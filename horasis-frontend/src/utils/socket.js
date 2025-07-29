import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'https://socialfb.horasis.org';
export const socket = (token) => io(URL, {
    autoConnect: false,
    auth: {
        token: "Bearer " + token
    },
});