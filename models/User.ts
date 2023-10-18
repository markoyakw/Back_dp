import { model } from 'mongoose';
import { Schema } from 'mongoose';
import { IUser } from '../../shared/test';

const User = new Schema<IUser>({
    login: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    tests: [{ type: Schema.Types.ObjectId, ref: "Test" }],
    testResultsById: [{
        ref: { type: Schema.Types.ObjectId, ref: "Test" },
        name: { type: String, required: true },
        description: { type: String },
        createdAt: { type: Number, required: true },
        testResults: [{type: Schema.Types.ObjectId, ref: "TestResult"}]
    }],
})

module.exports = model("User", User)