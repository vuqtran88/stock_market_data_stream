const finnhub = require('finnhub');

export interface StockData {
  ticker: string;
  price: number;
  change: number;
  percentChange: number;
  timestamp: number;
}

export async function fetchStockData(): Promise<StockData> {
  try {
    // Set up the API key for authentication
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      throw new Error('FINNHUB_API_KEY is not set in environment variables.');
    }

    finnhub.ApiClient.instance.authentications['api_key'].apiKey = apiKey;
    const finnhubClient = new finnhub.DefaultApi();

    // Wrap the callback in a Promise
    const stockData: StockData = await new Promise((resolve, reject) => {
      finnhubClient.quote('AAPL', (error: any, data: { c: string, d: string, dp: string }) => {
        if (error) {
          return reject(error);
        }

        resolve({
          ticker: 'AAPL',
          change: parseFloat(data.d),
          percentChange: parseFloat(data.dp),
          price: parseFloat(data.c),
          timestamp: Date.now(),
        });
      });
    });

    return stockData;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
}