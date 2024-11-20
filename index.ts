import { checkActiveTests, checkSetToActivateTests } from './utils/checkTestsActivation';
import express from "express";
import mongoose, { ConnectOptions } from "mongoose"
import cookieParser from "cookie-parser"
import authRouter from "./routers/authRouter"
import testsRouter from "./routers/testsRouter"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()
const PORT = process.env.PORT || 5000
const app = express();
app.use(cors({
    origin: 'https://yakovenkodiploma.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use("/auth", authRouter)
app.use("/tests", testsRouter)

app.get("/", (req, res) => res.send("I exist"));

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as ConnectOptions)
        mongoose.set('strictQuery', true)

        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
        checkActiveTests()
        checkSetToActivateTests()
    }
    catch (e) {
        console.log(e)
    }
}

start()
