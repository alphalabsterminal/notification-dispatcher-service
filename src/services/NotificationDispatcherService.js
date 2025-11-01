class NotificationDispatcherService {
    constructor(redisRepo, signalService, userService, kafkaProducer, binanceService) {
        this.redisRepo = redisRepo;
        this.signalService = signalService;
        this.userService = userService;
        this.producer = kafkaProducer;
        this.binanceService = binanceService;
    }

    async checkSignalsAndDispatch() {
        console.log("Checking signal...");

        const symbols = await this.binanceService.getAllSymbols();
        const oneHourAgo = Date.now() - 3600 * 1000;
        const now = Date.now();

        for (const symbol of symbols) {
            const data = await this.redisRepo.getMarketData(symbol, oneHourAgo, now);
            if (!data || data.length === 0) continue; // skip if no data in Redis
            
            if (this.signalService.isShortSign(data)) {
                await this.dispatchSignal("short", symbol);
            }

            if (this.signalService.isLongSign(data)) {
                await this.dispatchSignal("long", symbol);
            }
        }

        console.log("Done checking and dispatching!");
    }

    async dispatchSignal(signalType, symbol) {
        const users = await this.userService.getSubscribedUsers();

        for (const user of users) {
            await this.producer.send({
                topic: "signal-notifications",
                messages: [{
                    key: symbol,
                    value: JSON.stringify({
                        symbol,
                        signal: signalType,
                        time: Date.now(),
                        userId: user.id,
                        platform: user.platform, // Should contains something like W, E(W for WA, E for Email)
                        countryCode: user.countryCode,
                        phoneNumber: user.phoneNumber,
                        email: user.email
                    })
                }]
            });
        }
    }
}

module.exports = NotificationDispatcherService;