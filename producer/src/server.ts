import { Kafka, Producer } from 'kafkajs';
import { fetchStockData, StockData } from './stockFetcher';

// Kafka configuration
const kafka = new Kafka({
  clientId: 'stock-producer',
  brokers: ['localhost:9092'], // Replace with your Kafka broker
});

const topic = 'stock-market-stream';

async function produceStockData() {
  const producer: Producer = kafka.producer();

  try {
    // Connect the producer
    await producer.connect();
    console.log('Kafka Producer connected');

    // Periodically fetch and send stock data
    setInterval(async () => {
      try {
        const stockData: StockData = await fetchStockData();

        // Send data to Kafka topic
        await producer.send({
          topic,
          messages: [
            {
              key: stockData.ticker,
              value: JSON.stringify(stockData),
            },
          ],
        });

        console.log('Produced to Kafka:', stockData);
      } catch (error) {
        console.error('Failed to produce message:', error);
      }
    }, 20000); // Fetch every 20 seconds
  } catch (error) {
    console.error('Kafka Producer error:', error);
  }
}

produceStockData();