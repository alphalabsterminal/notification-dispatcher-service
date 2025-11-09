import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

class BinanceService {
    constructor() {
        this.baseUrl = process.env.BINANCE_FAPI;
    }

    async getAllSymbols() {
        const { data } = await axios.get(`https://fapi.binance.com/fapi/v1/exchangeInfo`);
        return data.symbols
            .filter(s => s.symbol.endsWith("USDT"))
            .map(s => s.symbol.toUpperCase());
    }
}

export default BinanceService;