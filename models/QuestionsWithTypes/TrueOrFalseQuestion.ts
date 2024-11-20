import { Schema } from "mongoose";
import { ITrueOrFalseQuestion, QuestionTypes } from "../../types/test";
import Question from "./../Question"

const TrueOrFalseQuestionSchema = new Schema<ITrueOrFalseQuestion>({
    type: { type: String, required: true, default: QuestionTypes.trueOrFalse },
    question: { type: String, required: true },
    answer: { type: Boolean, required: true }
})

const TrueOrFalseQuestion = Question.discriminator<ITrueOrFalseQuestion>('TrueOrFalseQuestion', TrueOrFalseQuestionSchema);

export default TrueOrFalseQuestion;