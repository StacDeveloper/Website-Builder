import express, { Router } from "express"
import { createUserProject, getAllProject, getSingleProject, GetUserCredits, purchaseCredits, toggleProjectPublish } from "../controllers/userController.js"
import { protect } from "../middlewares/authentication.js"

const userRouter: Router = express.Router()

userRouter.get("credits", protect, GetUserCredits)
userRouter.post("/project", protect, createUserProject)
userRouter.get("/project/:projectId", protect, getSingleProject)
userRouter.get("/projects", protect, getAllProject)
userRouter.get("/publish-toggle/:projectId", protect, toggleProjectPublish)
userRouter.post("/purchase-credits", protect, purchaseCredits)

export default userRouter