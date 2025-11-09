import dotenv from "dotenv";
import RedisClient from "./config/redis.js";
import { producer } from "./config/kafka.js";
import RedisRepository from "./repositories/RedisRepository.js";
import SignalDetectionService from "./services/SignalDetectionService.js";
import NotificationDispatcherService from "./services/NotificationDispatcherService.js";
import UserService from "./services/UserService.js";
import BinanceService from "./services/BinanceService.js";

dotenv.config();

const redisRepo = new RedisRepository(RedisClient);
const signalService = new SignalDetectionService();
const userService = new UserService();
const binanceService = new BinanceService();

const dispatcher = new NotificationDispatcherService(
    redisRepo,
    signalService,
    userService,
    producer,
    binanceService
);

(async () => {
    await producer.connect();

    // Run every 1 minute
    setInterval(async () => {
        await dispatcher.checkSignalsAndDispatch();
    }, 60 * 1000);
})();