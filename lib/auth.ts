import dns from "node:dns";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// Resolve querySrv ECONNREFUSED on Windows local networks with MongoDB Atlas
if (typeof dns.setServers === "function") {
    try {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch {
        // Fallback to default DNS
    }
}
if (dns.promises && typeof dns.promises.setServers === "function") {
    try {
        dns.promises.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch {
        // Fallback to default DNS
    }
}

/**
 * Returns the MongoDB connection string.
 * If the connection string is a MongoDB Atlas SRV URL that fails on Windows/ISP DNS,
 * translates to the direct replica-set seed list to bypass querySrv DNS lookups completely.
 */
function getMongoUrl(): string {
    const raw = process.env.MONGODB_URL || "";
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

const client = new MongoClient(getMongoUrl());
const db = client.db("rentora");

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
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
