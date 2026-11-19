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

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db("rentora");

export const auth = betterAuth({
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