import { Kafka } from 'kafkajs';
import { Server } from 'socket.io';
import http from 'http';

const kafka = new Kafka({
  clientId: 'stock-consumer',
  brokers: ['localhost:9092'], // Kafka broker address
});
const topic = 'stock-market-stream';

const consumer = kafka.consumer({ groupId: 'stock-group' });

const startConsume = async (io: Server) => {
  await consumer.connect();
  await consumer.subscribe({ topic });

  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log({
        value: message.value?.toString() || '',
      });

      io.emit('stock-data', message.value?.toString() || '');
    },
  });
};

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('Client connected');
});

server.listen(3001, () => {
  console.log('Socket.io server running on port 3000');
});

startConsume(io);


