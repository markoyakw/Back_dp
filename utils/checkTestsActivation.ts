import { activateTest, deactivateTest } from './activateDeactivateTest';
import { Document, Model } from "mongoose";
import { ITest } from "../types/test";
const Test = require("../models/Test") as Model<ITest>

const now = Date.now()

export const checkActiveTests = async () => {
    let activationTimer
    const activeTests = await Test.find({
        isActive: true
    })

    if (!activeTests) {
        return
    }

    activeTests.forEach(async (activeTest) => {
        if (activeTest.deactivateAt && activeTest.deactivateAt <= now) {
            deactivateTest(activeTest)
        }
        else if (activeTest.deactivateAt && activeTest.activateAt && activeTest.deactivateAt > now ) {
            const deactivateTime = activeTest.deactivateAt - now
            activationTimer = setTimeout(async () => {
                deactivateTest(activeTest)
            }, deactivateTime)
        }
    })
}

export const checkSetToActivateTests = async () => {
    let deactivationTimer
    const setToActivateTests = await Test.find({
        setToActivate: true
    })

    if (!setToActivateTests) {
        return
    }

    setToActivateTests.forEach(async (activeTest) => {
        if (activeTest.activateAt && activeTest.activateAt <= now) {
            activateTest(activeTest)
        }
        else if (activeTest.deactivateAt && activeTest.deactivateAt > now && activeTest.activateAt) {
            const activateTime = activeTest.activateAt - now
            deactivationTimer = setTimeout(async () => {
                activateTest(activeTest)
            }, activateTime)
        }
    })
}
