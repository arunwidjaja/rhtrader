import * as dotenv from 'dotenv'
import * as path from 'path'

export class eTradeTrader {
    private apiKey: string;
    
    constructor() {
        dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
        this.apiKey = process.env.ET_API_KEY ?? ""
    }
}