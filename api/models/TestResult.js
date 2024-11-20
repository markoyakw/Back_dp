"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TestResult = new mongoose_1.Schema({
    testId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Test", required: true },
    name: { type: String, required: true },
    description: { type: String },
    theoreticalPart: { type: String },
    questionGrades: [
        {
            questionGrade: {
                answerIsRightArr: {
                    type: [Boolean],
                },
                questionIsRight: {
                    type: Boolean,
                    default: null,
                }
            },
            question: { type: mongoose_1.Schema.Types.ObjectId, ref: "Question" }
        }
    ],
    passedBy: {
        username: { type: String, reqired: true },
        login: { type: String, reqired: true }
    },
    grade: {
        numberGrade: {
            value: { type: Number, required: true },
            label: { type: String, required: true },
        },
        percentageGrade: {
            value: { type: Number, required: true },
            label: { type: String, required: true },
        },
    },
    passedAt: Number
});
TestResult.pre('save', function (next) {
    this.passedAt = Number(Date.now());
    next();
});
exports.default = (0, mongoose_1.model)('TestResult', TestResult);
//# sourceMappingURL=TestResult.js.map