import Redis from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = Redis.createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

await redisClient.connect(); // Ensure connection on import

export default redisClient;