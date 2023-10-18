import { ITest } from './../types/test';
import { Schema, model } from 'mongoose';

const Test = new Schema<ITest>({
    name: { type: String, required: true },
    description: { type: String },
    theoreticalPart: { type: String },
    updatedAt: { type: Number, required: true },
    questions: [
        {
            type: Schema.Types.ObjectId,
            ref: "Question",
            required: true,
        },
    ],
    isActive: { type: Boolean, required: true, default: false },
    setToActivate: { type: Boolean, required: true, default: false },
    activateAt: { type: Number },
    deactivateAt: { type: Number }
});

Test.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = model('Test', Test);