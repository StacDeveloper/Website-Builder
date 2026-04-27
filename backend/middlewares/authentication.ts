import { clerkClient } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../configs/db.js";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.auth()
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authorized" })
        }
        const clerkUser = await clerkClient.users.getUser(userId)
        let user = await prisma.user.findUnique({
            where: { id: userId }
        })
        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: userId,
                    email: clerkUser.primaryEmailAddress?.emailAddress || "",
                    name: clerkUser.firstName || "" + " " + clerkUser.lastName || "",

                }
            })
        }
        req.userId = userId
        next()
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}