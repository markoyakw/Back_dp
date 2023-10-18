import { ITest } from './../../front_dp/ts/test';
import { Schema, model } from "mongoose";

const ActiveTest = new Schema<{ test: ITest }>({
    test: { type: Schema.Types.ObjectId, ref: "Test"}
});

module.exports = model("ActiveTest", ActiveTest);