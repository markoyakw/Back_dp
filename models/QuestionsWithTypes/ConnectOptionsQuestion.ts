import { Schema } from "mongoose";
import { IConnectOptionsAnswerPair, IConnectOptionsQuestion, QuestionTypes } from "../../../shared/test";
import Question from "./../Question"

const ConnectOptionsQuestionSchema = new Schema<IConnectOptionsQuestion>({
    type: { type: String, required: true, default: QuestionTypes.connectOptions },
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
            validator: (answersArray: IConnectOptionsAnswerPair[]) => {
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

const ConnectOptionsQuestion = Question.discriminator<IConnectOptionsQuestion>('ConnectOptionsQuestion', ConnectOptionsQuestionSchema);

export default ConnectOptionsQuestion;