import { io } from "socket.io-client";

const socket = io("https://hunky-butler-backend.vercel.app/api");
export default socket;
