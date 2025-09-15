import cookieParser from "cookie-parser";
import express from "express"
const app = express();
import routes from './src/routes/index.js'


import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from "./src/config/db.js";




dotenv.config();




// app.post(
//   "/api/webhook",
//   express.raw({ type: "application/json" }),
//   webhook
// );
app.use(express.json());
app.use(cookieParser());


app.use(cors({
    origin: ['http://localhost:3000',  'http://localhost:5174', 'http://localhost:5173','http://localhost:3001', 'http://localhost:3002' ],
    credentials: true 
}));




app.use('/api', routes);
app.get('/', (req, res)=>{
    return res.status(200).json({
        message:"Server Running successfully"
    })
})



await connectDB()


app.use((err, req, res, next) => {
    // console.log(err);
    res.status(500).send("Something Broke!")
});

export default app;
