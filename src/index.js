require("dotenv").config();
const RedisClient = require("./config/redis");
const { producer } = require("./config/kafka");
const RedisRepository = require("./repositories/RedisRepository");
const SignalDetectionService = require("./services/SignalDetectionService");
const NotificationDispatcherService = require("./services/NotificationDispatcherService");
const UserService = require("./services/UserService");
const BinanceService = require("./services/BinanceService");

const redisRepo = new RedisRepository(RedisClient);
const signalService = new SignalDetectionService();
const userService = new UserService();
const binanceService = new BinanceService();

const dispatcher = new NotificationDispatcherService(redisRepo, signalService, userService, producer, binanceService);

(async () => {
    await producer.connect();

    // Run every 1 minute
    setInterval(async () => {
        await dispatcher.checkSignalsAndDispatch();
    }, 60 * 1000);
})();