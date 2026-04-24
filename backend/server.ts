import express from "express"
import type { Express, Request, Response } from "express"
import dotenv from "dotenv"
import cors from "cors"
import { toNodeHandler } from "better-auth/node"
import { auth } from "./configs/auth.js"
import userRouter from "./routes/user.routes.js"
import projectRouter from "./routes/project.routes.js"
import { stripeWebHook } from "./controllers/stripeWebhook.js"
dotenv.config()

const corsOption = {
    origin: process.env.TRUSTED_ORIGIN?.split(",") || [],
    credentials: true,
}
const app: Express = express()
const PORT = process.env.PORT || 3000

// middlewares
app.use(express.json({ limit: "50mb" }))
app.use(cors(corsOption))
app.all("/api/auth", toNodeHandler(auth))
app.use("/api/user", userRouter)
app.use("/api/project", projectRouter)
app.post("/api/stripe", express.raw({ type: "application/json" }), stripeWebHook)
app.use("/", (req: Request, res: Response) => {
    res.json({ success: true, message: "Server started successfully" })
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
