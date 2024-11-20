"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const test_1 = require("../../types/test");
const Question_1 = __importDefault(require("./../Question"));
const TextInputQuestionSchema = new mongoose_1.Schema({
    type: { type: String, required: true, default: test_1.QuestionTypes.textInput },
    question: { type: String, required: true },
    answers: [
        { answerText: { type: String, required: true } }
    ],
    answer: { type: String }
});
const TextInputQuestion = Question_1.default.discriminator('TextInputQuestion', TextInputQuestionSchema);
exports.default = TextInputQuestion;
//# sourceMappingURL=TextInputQuestion.js.map