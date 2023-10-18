import SingleMultipleCHoiceQuestion from '../models/QuestionsWithTypes/SingleMultipleChoiceQuestion';
import ConnectOptionsQuestion from '../models/QuestionsWithTypes/ConnectOptionsQuestion';
import EssayQuestion from '../models/QuestionsWithTypes/EssayQuestion';
import { FillTheGapsQuestion } from '../models/QuestionsWithTypes/FillTheGapsQuestion';
import TrueOrFalseQuestion from '../models/QuestionsWithTypes/TrueOrFalseQuestion';
import TextInputQuestion from '../models/QuestionsWithTypes/TextInputQuestion';
import { IQuestion, QuestionTypes } from '../../shared/test';
import { Schema } from 'mongoose';

const addQuestionAndGetId = async (question: IQuestion): Promise<Schema.Types.ObjectId> => {
    try {
        delete question._id

        if (question.type === QuestionTypes.singleMultipleChoice ||
            question.type === QuestionTypes.fillTheGaps ||
            question.type === QuestionTypes.textInput
        ) {
            question.answers.forEach(answer => {
                delete answer._id
            });
        }
        else if (question.type === QuestionTypes.connectOptions) {
            question.answers.forEach(answer => {
                delete answer[0]._id
                delete answer[1]._id
            })
        }

        switch (question.type) {
            case QuestionTypes.connectOptions:
                try {
                    const newConnectOptionsQuestion = new ConnectOptionsQuestion(question);
                    await newConnectOptionsQuestion.save();
                    return newConnectOptionsQuestion._id;
                } catch (error) {
                    console.error('Error creating ConnectOptionsQuestion:', error);
                    throw error;
                }
            case QuestionTypes.essay:
                const newEssayQuestion = await new EssayQuestion(question)
                await newEssayQuestion.save();
                return newEssayQuestion._id
            case QuestionTypes.fillTheGaps:
                const newFillTheGapsQuestion = await new FillTheGapsQuestion(question)
                await newFillTheGapsQuestion.save();
                return newFillTheGapsQuestion._id
            case QuestionTypes.singleMultipleChoice:
                const newSingleMultipleChoiceQuestion = new SingleMultipleCHoiceQuestion(question);
                await newSingleMultipleChoiceQuestion.save();
                return newSingleMultipleChoiceQuestion._id;
            case QuestionTypes.textInput:
                const newTextInputQuestion = await new TextInputQuestion(question)
                await newTextInputQuestion.save();
                return newTextInputQuestion._id
            case QuestionTypes.trueOrFalse:
                const newTrueOrFalseQuestion = await new TrueOrFalseQuestion(question)
                await newTrueOrFalseQuestion.save();
                return newTrueOrFalseQuestion._id
            default:
                return
        }
    } catch (error) {
        console.error('Помилка додавання запитання', error);
        throw error;
    }
}

export default addQuestionAndGetId