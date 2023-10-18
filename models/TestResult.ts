import { ITestResult } from './../types/test';
import { Schema, model } from 'mongoose';

const TestResult = new Schema<ITestResult>({
    testId: { type: Schema.Types.ObjectId, ref: "Test", required: true },
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
            question: { type: Schema.Types.ObjectId, ref: "Question" }
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

module.exports = model('TestResult', TestResult);