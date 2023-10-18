import { ITest } from '../types/test';
import { Document } from 'mongoose';
type ITestDocument = ITest & Document

export const deactivateTest = async (test: ITestDocument) => {
    test.activateAt = null
    test.deactivateAt = null
    test.setToActivate = false
    test.isActive = false
    await test.save()
};

export const activateTest = async (test: ITestDocument) => {
    test.setToActivate = false
    test.isActive = true
    await test.save()
};

export const setToActivateTest = async (test: ITestDocument, startTime: number, endTime: number) => {
    test.setToActivate = true
    test.activateAt = startTime
    test.deactivateAt = endTime
    await test.save()
};