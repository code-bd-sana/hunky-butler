import { io } from "socket.io-client";

const socket = io("https://hunky-butler-backend.vercel.app/api");
// const socket = io("http://localhost:5000");
export default socket;
