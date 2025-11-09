import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

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

export default BinanceService;