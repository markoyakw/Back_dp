import { IConnectOptionsQuestion, IFillTheGapsQuestion, IQuestion, ITest, ITestResult, ITextInputQuestion, ITrueOrFalseQuestion, IUser, IsingleMultipleChoiceAnswer, IsingleMultipleChoiceQuestion, QuestionTypes } from '../types/test';
const User = require("../models/User") as Model<IUser>
const Test = require("../models/Test") as Model<ITest>
const TestResult = require("../models/TestResult") as Model<ITestResult>
import { Request, Response } from 'express';
import addQuestionAndGetId from "../utils/addQuestionAndGetId"
import { Model } from 'mongoose';
import { activateTest, deactivateTest, setToActivateTest } from '../utils/activateDeactivateTest';
import Question from '../models/Question';
const axios = require('axios');

let activationTimer: NodeJS.Timeout
let deactivationTimer: NodeJS.Timeout

class testsController {
    async postTest(req: Request, res: Response) {
        try {
            const { name, description, questions, theoreticalPart } = req.body;

            const questionIds = await Promise.all(questions.map(async (question: IQuestion) => {
                return await addQuestionAndGetId(question);
            }));

            const newTest = new Test({
                name,
                description,
                theoreticalPart,
                questions: questionIds,
                updatedAt: "1",
            })

            await newTest.save()
            const populatedNewTest = await Test.findOne({ _id: newTest._id })
                .populate({
                    path: 'questions'
                })
                .exec();

            const newTestUser = await User.findOne({ _id: req.user.id })

            await newTestUser.updateOne({
                $push: { tests: newTest },
            });

            await newTestUser.updateOne({
                $push:
                {
                    testResultsById:
                    {
                        ref: newTest._id,
                        name: newTest.name,
                        description: newTest.description,
                        createdAt: newTest.updatedAt
                    }
                }
            });

            await newTestUser.save()

            res.json({ message: "Тест успішно створено 😎", newTest: populatedNewTest });

        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Помилка створення тесту. Спробуйте ще раз." });
        }
    }
    async generateQuestions(req: Request, res: Response) {
        try {
            const { theoreticalPart }: { theoreticalPart: string } = req.body;

            const prompt = `use given text to generate 5 quizzes in given format
            ${theoreticalPart}`

            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo-16k',
                max_tokens: 2048,
                messages: [
                    {
                        role: 'system',
                        content: `You are providing only json code for quizzes array, no other words and dont use spaces and tabulations for formating in format [{
                        type: "singleMultipleChoice",
                        question: string,
                        answers: [
                            {
                                answerText: string,
                                isRight: boolean
                            }
                        ] - array of answer variants, where right one has field isRight: true
                    }] `,
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.GPT_API_KEY}`,
                },
            });

            if (response["error"]) {
                return res.status(400).json({ message: response["error"]["message"] });
            }

            res.json({ questions: JSON.parse(response["data"]["choices"][0]["message"]["content"]) })
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Помилка генерації запитань. Спробуйте ще раз." });
        }
    }
    async deleteTest(req: Request, res: Response) {
        try {
            const user = await User.findOne({ _id: req.user.id })
            await user.updateOne({ $pull: { tests: req.query.id } })
            await Test.deleteOne({ _id: req.query.id })
            res.json({ message: "Тест успішно видалено", deletedTestId: req.query.id })
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: "Помилка видалення тесту" })
        }
    }
    async editTest(req: Request, res: Response) {
        try {
            const { test: editedTest }: { test: ITest } = req.body
            const test = await Test.findOne({ _id: editedTest._id })
            const questionIds = await Promise.all(editedTest.questions.map(async (question: IQuestion) => {
                return await addQuestionAndGetId(question);
            }));

            await test.updateOne({
                questions: questionIds,
                name: editedTest.name,
                description: editedTest.description,
                theoreticalPart: editedTest.theoreticalPart,
                updatedAt: Date.now()
            })

            await test.save()
            res.json({ message: "Тест успішно редаговано", editedTest: test });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Помилка редагування тесту" });
        }
    }
    async activateTest(req: Request, res: Response) {
        try {
            const { activatingTestId: _id, endTime, ...other } = req.body
            const startTime = other.startTime === "now" ? Date.now() : other.startTime
            const test = await Test.findOne({ _id })

            if (test.isActive) {
                return res.status(400).json({ message: "Обраний тест вже активний" })
            }

            const populatedTest = await test.populate({ path: '', select: '-__v', strictPopulate: false });
            await setToActivateTest(populatedTest, startTime, endTime)

            const currentTime = Number(new Date());
            const timeUntilActivation = startTime - currentTime;
            const timeUntilDeactivation = endTime - currentTime;

            if (await other.startTime === "now") {
                await activateTest(populatedTest)
            }

            else {
                activationTimer = setTimeout(async () => {
                    await activateTest(populatedTest)
                }, timeUntilActivation)
            }

            deactivationTimer = setTimeout(async () => {
                await deactivateTest(populatedTest)
            }, timeUntilDeactivation);


            const newTestUser = await User.findOne({ _id: req.user.id });

            const update = {
                $addToSet: {
                    testResultsById: {
                        ref: test._id,
                        name: test.name,
                        description: test.description,
                        createdAt: test.updatedAt,
                    },
                },
            };
            await newTestUser.updateOne(update);

            res.json({
                message: "Інформація про час активації збережена, очікуйте початок тестування ✨",
                activatedTest: populatedTest,
            });

        } catch (e) {
            console.error(e);
            res.status(400).json({ message: "Помилка активації тесту" });
        }
    }
    async deactivateTest(req: Request, res: Response) {
        try {
            const { deactivatingTestId: _id } = req.body;
            const test = await Test.findOne({ _id })

            if (test.isActive === false) {
                return res.status(400).json({ message: "Обраний тест не активний" });
            }

            const populatedTest = await test.populate({ path: '', select: '-__v', strictPopulate: false });

            await deactivateTest(populatedTest)

            clearTimeout(activationTimer);
            clearTimeout(deactivationTimer);


            res.json({
                message: "Тестування успішно завершено ✨",
                deactivatedTest: populatedTest,
            });

        } catch (e) {
            console.error(e);
            res.status(400).json({ message: "Помилка деактивації тесту" });
        }
    }
    async getTested(req: Request, res: Response) {
        try {
            const id = req.query.id
            const test = await Test.findOne({ _id: id })

            const populatedTest = await test.populate({ path: 'questions', select: '-__v', strictPopulate: false });

            if (populatedTest.isActive) {
                res.json({ test: populatedTest, message: "Тест успішно знайдено, вдалого тестування 😎" })
            }
            else {
                res.status(404).json({ message: "Цей тест наразі не активний 😴. зв'яжіться з автором для початку тестування." });
            }
        } catch (e) {
            console.error(e);
            res.status(400).json({ message: "Помилка пошуку тесту" });
        }
    }
    async postTestResult(req: Request, res: Response) {
        try {
            const { testResult } = req.body as { testResult: ITest }
            const passedBy = await User.findOne({ _id: req.user.id })
            const correctTest = await Test.findOne({ _id: testResult._id }).populate({ path: 'questions', select: '-__v', strictPopulate: false })
            const correctQuestions = correctTest.questions
            let essayCounter = 0

            const gradeQuestion = (question: IQuestion, questionId: number) => {
                switch (question.type) {
                    case QuestionTypes.singleMultipleChoice: {
                        const correctQuestion = correctQuestions[questionId] as IsingleMultipleChoiceQuestion
                        const answerIsRightArr = question.answers.map((answer, answerId) => {
                            if (answer.isRight && correctQuestion.answers[answerId].isRight) {
                                return true
                            }
                            if (!correctQuestion.answers[answerId].isRight && !answer.isRight) {
                                return null
                            }
                            else return false
                        })
                        let questionIsRight = answerIsRightArr.every(isRight => isRight === true || isRight === null) || answerIsRightArr.every(isRight => isRight === null)
                        return { answerIsRightArr, questionIsRight }
                    }
                    case QuestionTypes.fillTheGaps: {
                        const correctQuestion = correctQuestions[questionId] as IFillTheGapsQuestion
                        const gradedQuestion = question.answers.map((answer, answerId) => {
                            if (answer.type !== "fill") return null
                            if (answer.answerText.toLowerCase() === correctQuestion.answers[answerId].answerText.toLowerCase()) {
                                return true
                            }
                            else return false
                        })
                        const answerIsRightArr = gradedQuestion.filter(item => item !== undefined)
                        const questionIsRight = answerIsRightArr.every(answer => answer === true || answer === null)

                        return { answerIsRightArr, questionIsRight }
                    }
                    case QuestionTypes.connectOptions: {
                        const connectOptionsQuestion = question as IConnectOptionsQuestion;
                        let questionIsRight = true
                        const answerIsRightArr = question.answers.map((answerPair, answerPairId) => {
                            if (!connectOptionsQuestion.chosenAnswers[answerPairId]) return false
                            if (answerPair[1].answerText === connectOptionsQuestion.chosenAnswers[answerPairId].answerText) {
                                return true
                            }
                            else return false
                        })
                        answerIsRightArr.forEach(answerIsRight => {
                            if (!answerIsRight) {
                                questionIsRight = false
                            }
                        })

                        return { answerIsRightArr, questionIsRight }
                    }
                    case QuestionTypes.textInput: {
                        const textInputQuestion = question as ITextInputQuestion
                        let questionIsRight = false
                        textInputQuestion.answers.forEach(answer => {
                            if (answer.answerText.toLowerCase() === textInputQuestion.answer.toLowerCase()) {
                                questionIsRight = true
                            }
                        })
                        return { questionIsRight }
                    }
                    case QuestionTypes.trueOrFalse: {
                        const correctQuestion = correctQuestions[questionId] as ITrueOrFalseQuestion
                        let questionIsRight
                        if (question.answer === correctQuestion.answer) {
                            questionIsRight = true
                        }
                        else questionIsRight = false
                        return { questionIsRight }
                    }
                    case QuestionTypes.essay: {
                        essayCounter++
                        return { questionIsRight: null }
                    }
                }
            }
            const questionGrades = await Promise.all(testResult.questions.map(async (questionResult, questionResultId) => {
                const questionId = await addQuestionAndGetId(questionResult);
                const questionGrade = gradeQuestion(questionResult, questionResultId);

                return {
                    questionGrade,
                    question: questionId,
                };
            }));

            const gradeTest = () => {
                let numberGrade = 0
                const maxGrade = questionGrades.length - essayCounter

                const getNumberGrade = () => {
                    questionGrades.forEach(questionGrade => {
                        if (questionGrade.questionGrade.questionIsRight) {
                            numberGrade++
                        }
                    })
                    const getEssayCounterString = () => {
                        if (essayCounter) return " + " + essayCounter + " неоцінених есе"
                        else return ""
                    }
                    return ({
                        value: numberGrade,
                        label: numberGrade + "/" + maxGrade + getEssayCounterString()
                    })
                }

                const getPercentageGrade = () => {
                    const percentageGrade = numberGrade / maxGrade * 100
                    return ({
                        value: percentageGrade,
                        label: percentageGrade + "%"
                    })
                }

                return {
                    numberGrade: getNumberGrade(),
                    percentageGrade: getPercentageGrade()
                }
            }

            const getKeywordsFromQuestion = (question: IQuestion) => {
                switch (question.type) {
                    case QuestionTypes.connectOptions:
                        let connectOptionstext = ""
                        question.answers[0].forEach(answer => connectOptionstext = connectOptionstext + answer.answerText + " ")
                        return connectOptionstext
                    case QuestionTypes.fillTheGaps:
                        let fillTheGapstext = ""
                        question.answers.forEach(answer => {
                            if (answer.type === "text") {
                                fillTheGapstext = fillTheGapstext + answer.answerText + " "
                            }
                        })
                        return fillTheGapstext
                    case QuestionTypes.singleMultipleChoice:
                        let singleMultipleChoicetext = question.question
                        question.answers.forEach(answer => singleMultipleChoicetext = singleMultipleChoicetext + answer.answerText + " ")
                        return singleMultipleChoicetext
                    case QuestionTypes.textInput:
                        let textInputtext = " "
                        question.answers.forEach(answer => singleMultipleChoicetext = singleMultipleChoicetext + answer.answerText + " ")
                        return textInputtext
                    case QuestionTypes.trueOrFalse:
                        let trueOrFalsetext = question.question
                        return trueOrFalsetext
                    default:
                        return ""
                }
            }

            const highlightWrongParts = async () => {
                if (!testResult.theoreticalPart) return null
                const wrongQuestionsTagsArr = questionGrades.map((grade, gradeId) => {
                    if (grade.questionGrade.questionIsRight === false) {
                        return getKeywordsFromQuestion(testResult.questions[gradeId])
                    }
                    else return
                })

                if (!wrongQuestionsTagsArr || wrongQuestionsTagsArr.length === 0) return

                const wrongQuestionsTags = wrongQuestionsTagsArr.join(" ")
                const prompt = `text: ${testResult.theoreticalPart}, questions_tags: ${wrongQuestionsTags}`
                const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                    model: 'gpt-3.5-turbo-16k',
                    max_tokens: 2048,
                    messages: [
                        {
                            role: 'system',
                            content: `You have been provided with two pieces of information in Ukrainian: a text representing the theoretical part of a quiz and a list of question tags. 
                                These question tags correspond to incorrect answers in the quiz. 
                                Your task is to identify and highlight the relevant sections in the text (it should be exactly present in text, after "text:") to help 
                                students understand what they should review and memorize again. 
                                Your response should be a valid JSON array named "highlightedWrongPartsArr" within an object. This array should contain exact highlighted strings 
                                from the text that correspond to the provided question tags. 
                                If you cannot find any correlations between the text and the question tags or if the text is not suitable for highlighting, 
                                the returned array should be empty. Please ensure that the response is in the specified JSON format.
                                Example Response:
                                {
                                  "highlightedWrongPartsArr": ["Highlighted text 1", "Highlighted text 2"]
                                }`
                            ,
                        },
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                }, {
                    headers: {
                        'Authorization': `Bearer ${process.env.GPT_API_KEY}`,
                    },
                });

                if (response["error"]) {
                    console.log(response["error"])
                    return res.status(400).json({ message: response["error"]["message"] });
                }
                return JSON.parse(response["data"]["choices"][0]["message"]["content"])
            }

            const highlightedWrongPartsArr = await highlightWrongParts()
            const gradedTestResult = new TestResult({
                testId: testResult._id,
                name: testResult.name,
                description: testResult.description,
                theoreticalPart: testResult.theoreticalPart,
                questionGrades,
                message: 'Тест вдало відправлено на перевірку 😎',
                passedAt: Number(Date.now()),
                grade: gradeTest(),
                passedBy: {
                    login: passedBy.login,
                    username: passedBy.username
                }
            });

            await gradedTestResult.save();
            return res.json({ gradedTestResult, message: "Тест вдало відправлено на перевірку 😎", highlightedWrongPartsArr })
        } catch (e) {
            console.error(e);
            res.status(400).json({ message: "Помилка оцінювання тесту" });
        }
    }
    async testResultsByTestId(req: Request, res: Response) {
        try {
            const id = req.query.id
            const testResults = await TestResult.find({ testId: id })
                .populate({
                    path: 'questionGrades',
                    populate: {
                        path: 'question',
                        populate: {
                            path: 'answer',
                        },
                    },
                })
                .exec()
            if (testResults) {
                return res.json({ testResults, testId: id })
            }
            res.status(404).json({ message: "Результатів цього тесту немає" });
        } catch (e) {
            console.error(e);
            res.status(400).json({ message: "Помилка пошуку результату тесту" });
        }
    }
    async check(req: Request, res: Response) {
        return res.json({ test: "ok" })
    }

}

export default new testsController()
