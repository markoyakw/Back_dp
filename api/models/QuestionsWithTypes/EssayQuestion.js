"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const test_1 = require("../../types/test");
const Question_1 = __importDefault(require("./../Question"));
const EssayQuestionSchema = new mongoose_1.Schema({
    type: { type: String, required: true, default: test_1.QuestionTypes.essay },
    question: { type: String, required: true },
    answer: { type: String }
});
const EssayQuestion = Question_1.default.discriminator('EssayQuestion', EssayQuestionSchema);
exports.default = EssayQuestion;
//# sourceMappingURL=EssayQuestion.js.map