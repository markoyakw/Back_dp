"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SingleMultipleChoiceQuestion_1 = __importDefault(require("../models/QuestionsWithTypes/SingleMultipleChoiceQuestion"));
const ConnectOptionsQuestion_1 = __importDefault(require("../models/QuestionsWithTypes/ConnectOptionsQuestion"));
const EssayQuestion_1 = __importDefault(require("../models/QuestionsWithTypes/EssayQuestion"));
const FillTheGapsQuestion_1 = require("../models/QuestionsWithTypes/FillTheGapsQuestion");
const TrueOrFalseQuestion_1 = __importDefault(require("../models/QuestionsWithTypes/TrueOrFalseQuestion"));
const TextInputQuestion_1 = __importDefault(require("../models/QuestionsWithTypes/TextInputQuestion"));
const test_1 = require("../types/test");
const addQuestionAndGetId = async (question) => {
    try {
        delete question._id;
        if (question.type === test_1.QuestionTypes.singleMultipleChoice ||
            question.type === test_1.QuestionTypes.fillTheGaps ||
            question.type === test_1.QuestionTypes.textInput) {
            question.answers.forEach(answer => {
                delete answer._id;
            });
        }
        else if (question.type === test_1.QuestionTypes.connectOptions) {
            question.answers.forEach(answer => {
                delete answer[0]._id;
                delete answer[1]._id;
            });
        }
        switch (question.type) {
            case test_1.QuestionTypes.connectOptions:
                try {
                    const newConnectOptionsQuestion = new ConnectOptionsQuestion_1.default(question);
                    await newConnectOptionsQuestion.save();
                    return newConnectOptionsQuestion._id;
                }
                catch (error) {
                    console.error('Error creating ConnectOptionsQuestion:', error);
                    throw error;
                }
            case test_1.QuestionTypes.essay:
                const newEssayQuestion = await new EssayQuestion_1.default(question);
                await newEssayQuestion.save();
                return newEssayQuestion._id;
            case test_1.QuestionTypes.fillTheGaps:
                const newFillTheGapsQuestion = await new FillTheGapsQuestion_1.FillTheGapsQuestion(question);
                await newFillTheGapsQuestion.save();
                return newFillTheGapsQuestion._id;
            case test_1.QuestionTypes.singleMultipleChoice:
                const newSingleMultipleChoiceQuestion = new SingleMultipleChoiceQuestion_1.default(question);
                await newSingleMultipleChoiceQuestion.save();
                return newSingleMultipleChoiceQuestion._id;
            case test_1.QuestionTypes.textInput:
                const newTextInputQuestion = await new TextInputQuestion_1.default(question);
                await newTextInputQuestion.save();
                return newTextInputQuestion._id;
            case test_1.QuestionTypes.trueOrFalse:
                const newTrueOrFalseQuestion = await new TrueOrFalseQuestion_1.default(question);
                await newTrueOrFalseQuestion.save();
                return newTrueOrFalseQuestion._id;
            default:
                return;
        }
    }
    catch (error) {
        console.error('Помилка додавання запитання', error);
        throw error;
    }
};
exports.default = addQuestionAndGetId;
//# sourceMappingURL=addQuestionAndGetId.js.map