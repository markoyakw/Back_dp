"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const test_1 = require("../../types/test");
const Question_1 = __importDefault(require("./../Question"));
const ConnectOptionsQuestionSchema = new mongoose_1.Schema({
    type: { type: String, required: true, default: test_1.QuestionTypes.connectOptions },
    answers: {
        type: [
            [
                {
                    answerText: { type: String, required: true },
                },
            ],
        ],
        required: true,
        validate: {
            validator: (answersArray) => {
                answersArray.forEach(answersPair => {
                    return Array.isArray(answersPair) && answersPair.length === 2;
                });
            },
            message: "The 'answers' array must contain exactly two pairs of answers.",
        },
    },
    chosenAnswers: {
        type: {}
    },
    avaliableForChoosingAnswers: {
        type: [{
                answerText: { type: String },
            }]
    }
});
const ConnectOptionsQuestion = Question_1.default.discriminator('ConnectOptionsQuestion', ConnectOptionsQuestionSchema);
exports.default = ConnectOptionsQuestion;
//# sourceMappingURL=ConnectOptionsQuestion.js.map