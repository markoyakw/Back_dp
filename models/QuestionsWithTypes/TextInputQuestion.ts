import mongoose, { Schema } from "mongoose";
import { ITextInputQuestion, QuestionTypes } from "../../../shared/test";
import Question from "./../Question"

const TextInputQuestionSchema = new Schema<ITextInputQuestion>({
    type: { type: String, required: true, default: QuestionTypes.textInput },
    question: { type: String, required: true },
    answers: [
        { answerText: { type: String, required: true } }
    ],
    answer: { type: String }
});

const TextInputQuestion = Question.discriminator<ITextInputQuestion>('TextInputQuestion', TextInputQuestionSchema);

export default TextInputQuestion;