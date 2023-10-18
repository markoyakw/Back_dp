import { model } from 'mongoose';
import { Schema } from 'mongoose';
import { IQuestion } from '../types/test';

const Question = new Schema<IQuestion>()

export default model("Question", Question)