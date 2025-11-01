class RedisRepository {
    constructor(redisClient) {
        this.redis = redisClient;
        this.redis.connect();
    }

    async getMarketData(symbol, startTime, endTime) {
        // get all keys for this symbol
        const keys = await this.redis.keys(`market:${symbol}:*`);

        if (keys.length === 0) return [];

        // map keys to { key, ts }
        const withTimestamps = keys.map(k => {
            const parts = k.split(":");
            return { key: k, ts: parseInt(parts[2], 10) };
        });

        // get the last snapshot <= startTime (1h ago logic)
        const pastCandidates = withTimestamps.filter(k => k.ts <= startTime);
        const pastKey = pastCandidates.length > 0
            ? pastCandidates.reduce((prev, curr) => (curr.ts > prev.ts ? curr : prev))
            : null;

        // get the snapshot closest to endTime
        const nowKey = withTimestamps.reduce((prev, curr) =>
            Math.abs(curr.ts - endTime) < Math.abs(prev.ts - endTime) ? curr : prev
        );

        // fetch values
        const [pastVal, nowVal] = await Promise.all([
            pastKey ? this.redis.get(pastKey.key) : Promise.resolve(null),
            nowKey ? this.redis.get(nowKey.key) : Promise.resolve(null)
        ]);

        // if pastVal is missing, return empty array
        if (!pastVal) return [];

        // return as array with exactly two items
        return [
            JSON.parse(pastVal),
            nowVal ? JSON.parse(nowVal) : null
        ];
    }

    async subscribe(channel, callback) {
        await this.redis.subscribe(channel, callback);
    }
}

module.exports = RedisRepository;