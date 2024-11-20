"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FillTheGapsQuestion = exports.FillTheGapsFillAnswer = exports.FillTheGapsTextAnswer = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const test_1 = require("../../types/test");
const Question_1 = __importDefault(require("./../Question"));
const FillTheGapsTextAnswerSchema = new mongoose_1.Schema({
    type: { type: String, required: true, default: "text" },
    answerText: { type: String, required: true }
});
const FillTheGapsFillAnswerSchema = new mongoose_1.Schema({
    type: { type: String, required: true, default: "fill" },
    answerText: { type: String, required: true }
});
const FillTheGapsTextAnswer = mongoose_1.default.model('FillTheGapsTextAnswer', FillTheGapsTextAnswerSchema);
exports.FillTheGapsTextAnswer = FillTheGapsTextAnswer;
const FillTheGapsFillAnswer = mongoose_1.default.model('FillTheGapsFillAnswer', FillTheGapsFillAnswerSchema);
exports.FillTheGapsFillAnswer = FillTheGapsFillAnswer;
const FillTheGapsQuestionSchema = new mongoose_1.Schema({
    type: { type: String, required: true, default: test_1.QuestionTypes.fillTheGaps },
    answers: [{
            type: { type: String, required: true, default: "fill" },
            answerText: { type: String, required: true }
        },
        {
            type: { type: String, required: true, default: "text" },
            answerText: { type: String, required: true }
        }
    ]
});
const FillTheGapsQuestion = Question_1.default.discriminator('FillTheGapsQuestion', FillTheGapsQuestionSchema);
exports.FillTheGapsQuestion = FillTheGapsQuestion;
//# sourceMappingURL=FillTheGapsQuestion.js.map