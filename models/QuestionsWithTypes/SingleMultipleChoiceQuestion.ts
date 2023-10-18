import mongoose, { Schema } from "mongoose";
import { IsingleMultipleChoiceQuestion, QuestionTypes } from "../../types/test";
import Question from "./../Question"

const SingleMultipleCHoiceQuestionSchema = new Schema<IsingleMultipleChoiceQuestion>({
    type: { type: String, required: true, default: QuestionTypes.singleMultipleChoice },
    question: { type: String, required: true },
    answers: [{
        answerText: { type: String },
        isRight: { type: Boolean },
    }],
});
  
const SingleMultipleChoiceQuestion =  Question.discriminator<IsingleMultipleChoiceQuestion>('SingleMultipleChoiceQuestion', SingleMultipleCHoiceQuestionSchema);

export default SingleMultipleChoiceQuestion;