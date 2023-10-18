import mongoose, { Schema } from "mongoose";
import { IFillTheGapsFillAnswer, IFillTheGapsQuestion, QuestionTypes, IFillTheGapsTextAnswer } from "../../../shared/test";
import Question from "./../Question"

const FillTheGapsTextAnswerSchema = new Schema<IFillTheGapsTextAnswer>({
    type: { type: String, required: true, default: "text" },
    answerText: { type: String, required: true }
})

const FillTheGapsFillAnswerSchema = new Schema<IFillTheGapsFillAnswer>({
    type: { type: String, required: true, default: "fill" },
    answerText: { type: String, required: true }
})

const FillTheGapsTextAnswer = mongoose.model<IFillTheGapsTextAnswer>('FillTheGapsTextAnswer', FillTheGapsTextAnswerSchema);
const FillTheGapsFillAnswer = mongoose.model<IFillTheGapsFillAnswer>('FillTheGapsFillAnswer', FillTheGapsFillAnswerSchema);

const FillTheGapsQuestionSchema = new Schema<IFillTheGapsQuestion>({
    type: { type: String, required: true, default: QuestionTypes.fillTheGaps },
    answers: [{
        type: { type: String, required: true, default: "fill" },
        answerText: { type: String, required: true }
    },
    {
        type: { type: String, required: true, default: "text" },
        answerText: { type: String, required: true }
    }
    ]
})

const FillTheGapsQuestion =  Question.discriminator<IFillTheGapsQuestion>('FillTheGapsQuestion', FillTheGapsQuestionSchema);

export { FillTheGapsTextAnswer, FillTheGapsFillAnswer, FillTheGapsQuestion };