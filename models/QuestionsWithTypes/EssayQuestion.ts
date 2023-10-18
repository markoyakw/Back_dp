import mongoose, { Schema } from "mongoose";
import { IEssayQuestion, QuestionTypes } from "../../../shared/test";
import Question from "./../Question"

const EssayQuestionSchema = new Schema<IEssayQuestion>({
    type: { type: String, required: true, default: QuestionTypes.essay },
    question: { type: String, required: true },
    answer: { type: String }
});

const EssayQuestion = Question.discriminator<IEssayQuestion>('EssayQuestion', EssayQuestionSchema);

export default EssayQuestion;