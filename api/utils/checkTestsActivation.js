"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSetToActivateTests = exports.checkActiveTests = void 0;
const activateDeactivateTest_1 = require("./activateDeactivateTest");
const Test_1 = __importDefault(require("../models/Test"));
const now = Date.now();
const checkActiveTests = async () => {
    let activationTimer;
    const activeTests = await Test_1.default.find({
        isActive: true
    });
    if (!activeTests) {
        return;
    }
    activeTests.forEach(async (activeTest) => {
        if (activeTest.deactivateAt && activeTest.deactivateAt <= now) {
            (0, activateDeactivateTest_1.deactivateTest)(activeTest);
        }
        else if (activeTest.deactivateAt && activeTest.activateAt && activeTest.deactivateAt > now) {
            const deactivateTime = activeTest.deactivateAt - now;
            activationTimer = setTimeout(async () => {
                (0, activateDeactivateTest_1.deactivateTest)(activeTest);
            }, deactivateTime);
        }
    });
};
exports.checkActiveTests = checkActiveTests;
const checkSetToActivateTests = async () => {
    let deactivationTimer;
    const setToActivateTests = await Test_1.default.find({
        setToActivate: true
    });
    if (!setToActivateTests) {
        return;
    }
    setToActivateTests.forEach(async (activeTest) => {
        if (activeTest.activateAt && activeTest.activateAt <= now) {
            (0, activateDeactivateTest_1.activateTest)(activeTest);
        }
        else if (activeTest.deactivateAt && activeTest.deactivateAt > now && activeTest.activateAt) {
            const activateTime = activeTest.activateAt - now;
            deactivationTimer = setTimeout(async () => {
                (0, activateDeactivateTest_1.activateTest)(activeTest);
            }, activateTime);
        }
    });
};
exports.checkSetToActivateTests = checkSetToActivateTests;
//# sourceMappingURL=checkTestsActivation.js.map