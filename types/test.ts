import { Schema } from "mongoose"

export enum QuestionTypes {
    singleMultipleChoice = "singleMultipleChoice",
    textInput = "textInput",
    fillTheGaps = "fillTheGaps",
    trueOrFalse = "trueOrFalse",
    connectOptions = "connectOptions",
    essay = "essay"
}

export enum FillTheGapsAnswerTypes {
    text = "text",
    fill = "fill"
}

export type IUser = {
    _id: Schema.Types.ObjectId,
    login: string,
    password: string,
    username: string,
    tests: Array<ITest>,
    testResultsById: ITestResultsById
}


export type ITestResultsById = {
    ref: Schema.Types.ObjectId,
    name: string,
    description: string,
    createdAt: number,
    testResults: ITestResult[]
}

export type ITest = {
    _id: Schema.Types.ObjectId,
    name: string,
    description?: string,
    theoreticalPart?: string,
    questions: Array<IQuestion>,
    updatedAt: number,
    interfaceData: {
        loading: boolean,
        error: string | null,
        message: string | null,
        questionGenerationLoading: boolean,
        fieldsWereEdited?: boolean
    },
    isActive: Boolean,
    setToActivate: Boolean,
    activateAt?: number | null,
    deactivateAt?: number | null,
}

export type ITestResult = {
    testId: Schema.Types.ObjectId,
    name: string,
    description: string | null,
    theoreticalPart: string | null,
    questionGrades: Array<
        {
            questionGrade: IQuestionGrade,
            question: IQuestion
        }
    >,
    message: string,
    passedAt: number,
    grade: IGrade,
    passedBy: {
        username: string
        login: string
    }
}

export type IQuestionGrade = {
    answerIsRightArr?: boolean[],
    questionIsRight: boolean
}

export type IGrade = {
    numberGrade: {
        label: string,
        value: number
    },
    percentageGrade: {
        label: string,
        value: number
    },
}

// single/multiple choice

export interface IsingleMultipleChoiceQuestion {
    _id: Schema.Types.ObjectId,
    type: QuestionTypes.singleMultipleChoice,
    question: string,
    answers: Array<IsingleMultipleChoiceAnswer>
}

export interface IsingleMultipleChoiceAnswer {
    _id: Schema.Types.ObjectId,
    answerText: string,
    isRight: boolean
}

// text input

export interface ITextInputQuestion {
    _id: Schema.Types.ObjectId,
    type: QuestionTypes.textInput,
    question: string,
    answers: Array<ITextInputAnswer>
    answer: string
}

export interface ITextInputAnswer {
    _id: Schema.Types.ObjectId,
    answerText: string,
}

// fill the gaps

export interface IFillTheGapsQuestion {
    _id: Schema.Types.ObjectId,
    type: QuestionTypes.fillTheGaps,
    answers: Array<IFillTheGapsTextAnswer | IFillTheGapsFillAnswer>
}

export interface IFillTheGapsTextAnswer {
    _id: Schema.Types.ObjectId,
    type: "text",
    answerText: string
}

export interface IFillTheGapsFillAnswer {
    _id: Schema.Types.ObjectId,
    type: "fill",
    answerText: string
}

// true or false

export interface ITrueOrFalseQuestion {
    _id: Schema.Types.ObjectId,
    type: QuestionTypes.trueOrFalse,
    question: string,
    answer: ITrueOrFalseAnswer
}

export type ITrueOrFalseAnswer = boolean

//connectOptions

export interface IConnectOptionsQuestion {
    _id: Schema.Types.ObjectId,
    type: QuestionTypes.connectOptions,
    answers: Array<IConnectOptionsAnswerPair>,
    chosenAnswers: { [key: number]: IConnectOptionsAnswer }
    avaliableForChoosingAnswers: IConnectOptionsAnswer[]
}

export type IConnectOptionsAnswerPair = [IConnectOptionsAnswer, IConnectOptionsAnswer]

export interface IConnectOptionsAnswer {
    _id: Schema.Types.ObjectId,
    answerText: string,
}

//essay

export interface IEssayQuestion {
    _id: Schema.Types.ObjectId,
    type: QuestionTypes.essay,
    question: string,
    answer: IEssayAnswer
}

export type IEssayAnswer = string

export type IQuestion = IsingleMultipleChoiceQuestion | ITextInputQuestion | ITrueOrFalseQuestion | IFillTheGapsQuestion | IConnectOptionsQuestion | IEssayQuestion
export type IAnswer = IsingleMultipleChoiceAnswer | ITextInputAnswer | IFillTheGapsFillAnswer | IFillTheGapsTextAnswer | ITrueOrFalseAnswer | IConnectOptionsAnswerPair | IEssayAnswer