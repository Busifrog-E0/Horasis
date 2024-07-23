import { createServer } from 'http';
import { Server  } from 'socket.io';
import { decodeSocketIdToken, ensureSocketAuthorized, HandleMessageEvent, JoinRoom } from './controllers/socket-controller';

const SOCKET_PORT = 3001;  

const server = createServer();
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});



io.use(decodeSocketIdToken);
io.use(ensureSocketAuthorized("User"));

io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    JoinRoom(socket, io);
    HandleMessageEvent(socket, io);

    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
    });
});

server.listen(SOCKET_PORT, () => {
    console.log(`Socket.IO server is up at localhost:${SOCKET_PORT}`);
});
