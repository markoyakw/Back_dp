const Router = require("express")
const testsRouter = new Router()
import testsController from "../controllers/testsController"
import authMiddleware from "../middleware/authMiddleware"

testsRouter.post('/test', authMiddleware, testsController.postTest)
testsRouter.delete("/test/", authMiddleware, testsController.deleteTest)
testsRouter.patch("/test", authMiddleware, testsController.editTest)
testsRouter.post("/generateQuestions", authMiddleware, testsController.generateQuestions)
testsRouter.post("/activate", authMiddleware, testsController.activateTest)
testsRouter.post("/deactivate", authMiddleware, testsController.deactivateTest)
testsRouter.get("/getTested", authMiddleware, testsController.getTested)
testsRouter.post("/testResult", authMiddleware, testsController.postTestResult)
testsRouter.get("/testResultsByTestId", authMiddleware, testsController.testResultsByTestId)


// testsRouter.patch('/test', testsController.patchTest)
// testsRouter.delete("/test", testsController.deleteTest)
// testsRouter.get('/test/:id', testsController.getTest)
// testsRouter.post("/activateTest", testsController.activateTest)
// testsRouter.get("/userTests/:id", testsController.getUserTests)

export default testsRouter