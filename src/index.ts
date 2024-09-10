import express from 'express';
import connectDB from './utils/db';
const bp = require('body-parser')
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 5000;
const http = require('http').createServer(app);
const apiRouter = require('./routes/api');
export const  io = require('socket.io')(http, {cors:{
  origin: 'https://realtime-chess-client.vercel.app',
  methods: ["GET", "POST"],
  credentials: true
},path: '/api1/socket.io' });
app.use(bp.json());
app.use(cors({
  origin: 'https://realtime-chess-client.vercel.app',
  methods: ['GET', 'POST'],
  credentials: true
},));
const socketHandler = require('./utils/socket'); // Assuming handler file

// ... other server setup

io.on('connection', (socket) => socketHandler(socket)); // Pass socket to handler

// Connect to MongoDB
connectDB();
app.use('/api', apiRouter); // Mount API routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default app;