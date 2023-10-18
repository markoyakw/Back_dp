import { checkActiveTests, checkSetToActivateTests } from './../utils/checkTestsActivation';
import express from "express";
import mongoose, { ConnectOptions } from "mongoose"
import cookieParser from "cookie-parser"
import authRouter from "./../routers/authRouter"
import testsRouter from "./../routers/testsRouter"
require("dotenv").config()
import { Document, Model } from 'mongoose';
import { ITest } from "../types/test";
const Test = require("../models/Test") as Model<ITest>
import cors from "cors"

app.use(cors({
    origin: 'https://yakovenkomarko.netlify.app/',
    credentials: true
}))
const PORT = process.env.PORT || 5000
const app = express();

app.use(express.json())
app.use(cookieParser())

app.use("/auth", authRouter)
app.use("/tests", testsRouter)

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
