"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const User = new mongoose_2.Schema({
    login: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    tests: [{ type: mongoose_2.Schema.Types.ObjectId, ref: "Test" }],
    testResultsById: [{
            ref: { type: mongoose_2.Schema.Types.ObjectId, ref: "Test" },
            name: { type: String, required: true },
            description: { type: String },
            createdAt: { type: Number, required: true },
            testResults: [{ type: mongoose_2.Schema.Types.ObjectId, ref: "TestResult" }]
        }],
});
exports.default = (0, mongoose_1.model)("User", User);
//# sourceMappingURL=User.js.map