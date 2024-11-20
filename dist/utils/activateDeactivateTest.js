"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setToActivateTest = exports.activateTest = exports.deactivateTest = void 0;
const deactivateTest = async (test) => {
    test.activateAt = null;
    test.deactivateAt = null;
    test.setToActivate = false;
    test.isActive = false;
    await test.save();
};
exports.deactivateTest = deactivateTest;
const activateTest = async (test) => {
    test.setToActivate = false;
    test.isActive = true;
    await test.save();
};
exports.activateTest = activateTest;
const setToActivateTest = async (test, startTime, endTime) => {
    test.setToActivate = true;
    test.activateAt = startTime;
    test.deactivateAt = endTime;
    await test.save();
};
exports.setToActivateTest = setToActivateTest;
//# sourceMappingURL=activateDeactivateTest.js.map