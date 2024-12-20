'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

interface StockData {
    ticker: string;
    price: number;
    change: number;
    percentChange: number;
    timestamp: number;
}

export default function StockMarket() {
  const [stockData, setStockData] = useState<StockData[]>([]);

  useEffect(() => {
    const socket = io('http://localhost:3001'); // Backend WebSocket server

    socket.on('stock-data', (data) => {
      const parsedData: StockData = JSON.parse(data);
      setStockData((prevData) => {
        const updatedData = [...prevData, parsedData];
        return updatedData.slice(-5); // Keep only the last 5 data points
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log('Stock data updated:', stockData);
  }, [stockData]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Real-Time Stock Market Data</h1>
      <ul>
        {stockData.map((stock, index) => (
          <li key={index}>
            {stock.ticker}: ${stock.price} at {new Date(stock.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}