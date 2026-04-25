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
    origin: process.env.TRUSTED_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
}
const app: Express = express()
const PORT = process.env.PORT || 3000

app.use(cors(corsOption))
app.use("/api/auth", toNodeHandler(auth))
// middlewares
app.use((req, res, next) => {
    const origin = req.headers.origin
    const allowed = process.env.TRUSTED_ORIGIN?.split(",") || []
    if (origin && allowed.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin)
        res.setHeader("Access-Control-Allow-Credentials", "true")
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie")
    }
    if (req.method === "OPTIONS") {
        res.status(200).end()
        return
    }
    next()
})
app.use(express.json({ limit: "50mb" }))
app.use("/api/user", userRouter)
app.use("/api/project", projectRouter)
app.post("/api/stripe", express.raw({ type: "application/json" }), stripeWebHook)
app.use("/", (req: Request, res: Response) => {
    res.json({ success: true, message: "Server started successfully" })
})
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
