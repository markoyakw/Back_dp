"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("express");
const testsRouter = new Router();
const testsController_1 = __importDefault(require("../controllers/testsController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
testsRouter.post('/test', authMiddleware_1.default, testsController_1.default.postTest);
testsRouter.delete("/test/", authMiddleware_1.default, testsController_1.default.deleteTest);
testsRouter.patch("/test", authMiddleware_1.default, testsController_1.default.editTest);
testsRouter.post("/generateQuestions", authMiddleware_1.default, testsController_1.default.generateQuestions);
testsRouter.post("/activate", authMiddleware_1.default, testsController_1.default.activateTest);
testsRouter.post("/deactivate", authMiddleware_1.default, testsController_1.default.deactivateTest);
testsRouter.get("/getTested", authMiddleware_1.default, testsController_1.default.getTested);
testsRouter.post("/testResult", authMiddleware_1.default, testsController_1.default.postTestResult);
testsRouter.get("/testResultsByTestId", authMiddleware_1.default, testsController_1.default.testResultsByTestId);
testsRouter.get("/check", testsController_1.default.check);
// testsRouter.patch('/test', testsController.patchTest)
// testsRouter.delete("/test", testsController.deleteTest)
// testsRouter.get('/test/:id', testsController.getTest)
// testsRouter.post("/activateTest", testsController.activateTest)
// testsRouter.get("/userTests/:id", testsController.getUserTests)
exports.default = testsRouter;
//# sourceMappingURL=testsRouter.js.map