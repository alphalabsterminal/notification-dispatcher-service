const axios = require("axios");
require("dotenv").config();

class BinanceService {
    constructor() {
        this.baseUrl = process.env.BINANCE_FAPI;
    }

    async getAllSymbols() {
        const { data } = await axios.get(`${this.baseUrl}/exchangeInfo`);
        return data.symbols
            .filter(s => s.symbol.endsWith("USDT"))
            .map(s => s.symbol.toUpperCase());
    }
}

module.exports = BinanceService;