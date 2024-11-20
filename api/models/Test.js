"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Test = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String },
    theoreticalPart: { type: String },
    updatedAt: { type: Number, required: true },
    questions: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
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
exports.default = (0, mongoose_1.model)('Test', Test);
//# sourceMappingURL=Test.js.map