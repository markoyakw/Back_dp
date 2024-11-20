"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const checkTestsActivation_1 = require("./../utils/checkTestsActivation");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRouter_1 = __importDefault(require("./../routers/authRouter"));
const testsRouter_1 = __importDefault(require("./../routers/testsRouter"));
require("dotenv").config();
const Test = require("../models/Test");
const cors_1 = __importDefault(require("cors"));
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'https://yakovenkodiploma.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/auth", authRouter_1.default);
app.use("/tests", testsRouter_1.default);
const start = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        mongoose_1.default.set('strictQuery', true);
        app.listen(PORT, () => console.log(`server started on port ${PORT}`));
        (0, checkTestsActivation_1.checkActiveTests)();
        (0, checkTestsActivation_1.checkSetToActivateTests)();
    }
    catch (e) {
        console.log(e);
    }
};
start();
//# sourceMappingURL=index.js.map