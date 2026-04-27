import { AuthObject } from "@clerk/express";
import { Request } from "express";

declare global {
    namespace Express {
        interface Request {
            userId?: string
            projectId?: string
            auth: () => AuthObject
        }
    }
}