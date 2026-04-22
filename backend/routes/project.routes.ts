import express, { Router } from "express"
import { protect } from "../middlewares/authentication.js"
import { deleteProject, getProjectPreview, getPublishedProject, getSingleProjectById, makeRevison, rollbacktoVersion, SaveProjectCode } from "../controllers/projectController.js"

const projectRouter: Router = express.Router()

projectRouter.post("/revision/:projectId", protect, makeRevison)
projectRouter.put("/save/:projectId", protect, SaveProjectCode)
projectRouter.get("/rollback/:projectId/:versionId", protect, rollbacktoVersion)
projectRouter.delete("/:projectId", protect, deleteProject)
projectRouter.get("/preview/:projectId", protect, getProjectPreview)
projectRouter.get("/published", getPublishedProject)
projectRouter.get("/published/:projectId", getSingleProjectById)

export default projectRouter