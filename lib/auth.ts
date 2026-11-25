import dns from "node:dns";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// Resolve querySrv ECONNREFUSED on Windows local networks with MongoDB Atlas
// Guarded against serverless/cloud environments (e.g. Vercel / AWS Lambda) where custom DNS servers cause timeouts or failures
const isServerlessCloud = Boolean(
    process.env.VERCEL ||
    process.env.AWS_REGION ||
    process.env.AWS_EXECUTION_ENV
);

if (!isServerlessCloud && typeof dns.setServers === "function") {
    try {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch {
        // Fallback to default DNS
    }
}
if (!isServerlessCloud && dns.promises && typeof dns.promises.setServers === "function") {
    try {
        dns.promises.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch {
        // Fallback to default DNS
    }
}

/**
 * Returns the MongoDB connection string.
 * On Vercel / cloud serverless, returns the configured MONGODB_URL directly.
 * On local Windows development, translates to the direct replica-set seed list
 * if using the c-1 cluster to bypass querySrv DNS lookups.
 */
function getMongoUrl(): string {
    const raw = process.env.MONGODB_URL || "";
    if (process.env.VERCEL) {
        return raw;
    }
    if (raw.includes("c-1.pbzyvag.mongodb.net")) {
        try {
            const u = new URL(raw);
            const user = u.username;
            const pass = u.password;
            return `mongodb://${user}:${pass}@ac-1svgrip-shard-00-00.pbzyvag.mongodb.net:27017,ac-1svgrip-shard-00-01.pbzyvag.mongodb.net:27017,ac-1svgrip-shard-00-02.pbzyvag.mongodb.net:27017/rentora?ssl=true&replicaSet=atlas-12x9s5-shard-0&authSource=admin&retryWrites=true&w=majority`;
        } catch {
            return raw;
        }
    }
    return raw;
}

// Global caching for MongoClient to prevent connection exhaustion in serverless environments
declare global {
    // eslint-disable-next-line no-var
    var _mongoClientInstance: MongoClient | undefined;
}

let client: MongoClient;
if (!global._mongoClientInstance) {
    global._mongoClientInstance = new MongoClient(getMongoUrl());
}
client = global._mongoClientInstance;
const db = client.db("rentora");

/**
 * Dynamically determines the canonical base URL for Better Auth,
 * ensuring OAuth redirects and callbacks point to the live Vercel domain.
 */
function getBaseUrl(): string {
    const envUrl = process.env.BETTER_AUTH_URL;
    if (envUrl && !envUrl.includes("localhost")) {
        return envUrl.replace(/\/$/, "");
    }
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    return envUrl || "http://localhost:3000";
}

export const auth = betterAuth({
    baseURL: getBaseUrl(),
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: [
        "http://localhost:3000",
        "https://rentaro-client.vercel.app",
        "https://rentora-client.vercel.app",
        ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
        ...(process.env.VERCEL_PROJECT_PRODUCTION_URL ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`] : []),
        ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL.replace(/\/$/, "")] : []),
    ],
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "customer",
                input: true,
            },
        },
    },
});
