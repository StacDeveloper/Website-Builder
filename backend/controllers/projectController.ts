import type { Request, Response } from "express"
import { prisma } from "../configs/db.js"
import openai from "../configs/openai.js"

export const makeRevison = async (req: Request, res: Response) => {
    const userId = req.userId
    try {

        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!userId || !user) {
            return res.status(401).json({ success: false, message: "User not found" })
        }
        if (user.credits < 5) {
            return res.status(400).json({ success: false, message: "Purchase more credits" })
        }
        const { projectId } = req.params as { projectId: string }
        const { message } = req.body
        if (!projectId || !message || message.trim() === "") {
            return res.status(400).json({ success: false, message: "Please enter a valid prompt" })
        }
        const currentproject = await prisma.websiteProject.findUnique({
            where: { id: projectId, userId },
            include: { versions: true }
        })
        if (!currentproject) {
            return res.status(404).json({ success: false, message: "Project Not Found" })
        }
        await prisma.conversation.create({
            data: {
                role: "user",
                content: message,
                projectId
            }
        })
        await prisma.user.update({
            where: { id: userId },
            data: {
                credits: { decrement: 5 }
            }
        })
        const promptEnhnaceResponse = await openai.chat.completions.create({
            model: "z-ai/glm-4.5-air:free",
            messages: [
                {
                    role: "system",
                    content: `You are a prompt enhancement specialist. The user wants to make changes to their website. Enhance their request to be more specific and actionable for a web developer.

                              Enhance this by:
                              1. Being specific about what elements to change
                              2. Mentioning design details (colors, spacing, sizes)
                              3. Clarifying the desired outcome
                              4. Using clear technical terms
                              Return ONLY the enhanced request, nothing else. Keep it concise (1-2 sentences).`
                },
                {
                    role: "user",
                    content: `User's request: "${message}"`
                }
            ]
        })
        const enhancedPrompt = promptEnhnaceResponse.choices[0].message.content
        await prisma.conversation.create({
            data: {
                role: "assistant",
                content: `I've enhanced your prompt to: "${enhancedPrompt}"`,
                projectId
            }
        })
        await prisma.conversation.create({
            data: {
                role: "assistant",
                content: "Now making changes to your website...",
                projectId
            }
        })

        const codeGenerateResponse = await openai.chat.completions.create({
            model: "z-ai/glm-4.5-air:free",
            messages: [
                {
                    role: "system",
                    content: `You are an expert web developer. 
                            CRITICAL REQUIREMENTS:
                            - Return ONLY the complete updated HTML code with the requested changes.
                            - Use Tailwind CSS for ALL styling (NO custom CSS).
                            - Use Tailwind utility classes for all styling changes.
                            - Include all JavaScript in <script> tags before closing </body>
                            - Make sure it's a complete, standalone HTML document with Tailwind CSS
                            - Return the HTML Code Only, nothing else

                            Apply the requested changes while maintaining the Tailwind CSS styling approach.`
                },
                {
                    role: "user",
                    content: `Here is the current code: "${currentproject.current_code}" The user wants this change: "${enhancedPrompt}"`
                }
            ]
        })

        const code = codeGenerateResponse.choices[0].message.content || ""
        const version = await prisma.version.create({
            data: {
                code: code.replace(/```[a-z]*\n?/gi, "").replace(/```$/g, "").trim(),
                description: "Changes Made",
                projectId
            }
        })
        await prisma.conversation.create({
            data: {
                role: "assistant",
                content: "I've made the changes to your website! You can now preview it",
                projectId
            }
        })
        await prisma.websiteProject.update({
            where: {
                id: projectId
            }, data: {
                current_code: code.replace(/```[a-z]*\n?/gi, "").replace(/```$/g, "").trim(),
                current_version_index: version.id
            }
        })
        res.status(200).json({ success: true, message: "Changes Made Successfully" })
    } catch (error: any) {
        await prisma.user.update({
            where: { id: userId },
            data: { credits: { increment: 5 } }
        })
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}
export const rollbacktoVersion = async (req: Request, res: Response) => {
    const userId = req.userId
    try {
        if (!userId) {
            return res.status(400).json({ success: false, message: "Unauthorized" })
        }
        const { projectId, versionId } = req.params as { projectId: string, versionId: string }
        const project = await prisma.websiteProject.findUnique({
            where: { id: projectId, userId },
            include: { versions: true }
        })

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" })
        }
        const version = project.versions.find(v => v.id === versionId)
        if (!version) {
            return res.status(404).json({ success: false, message: "Version not found" })
        }
        await prisma.websiteProject.update({
            where: { id: projectId, userId },
            data: {
                current_code: version.code,
                current_version_index: version.id
            }
        })
        await prisma.conversation.create({
            data: {
                role: "assistant",
                content: `I've rolled back your webiste to "${versionId}". You can preview it`,
                projectId
            }
        })
        res.status(200).json({ success: true, message: `Version rolled back to ${versionId}` })
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}
export const deleteProject = async (req: Request, res: Response) => {
    const userId = req.userId
    const { projectId } = req.params as { projectId: string }
    try {
        if (!userId) {
            return res.status(400).json({ success: false, message: "Unauthorized" })
        }
        await prisma.websiteProject.delete({
            where: { id: projectId, userId }
        })
        res.status(200).json({ success: true, message: `Project deleted successfully` })
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getProjectPreview = async (req: Request, res: Response) => {
    const userId = req.userId
    try {
        const { projectId } = req.params as { projectId: string }
        if (!userId) {
            return res.status(400).json({ success: false, message: "Unauthorized" })
        }
        const project = await prisma.websiteProject.findFirst({
            where: { userId, id: projectId },
            include: { versions: true }
        })

        if (!project) {
            return res.status(404).json({ success: true, message: "Project not found" })
        }
        res.status(200).json({ success: true, project })
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getPublishedProject = async (req: Request, res: Response) => {
    try {
        const projects = await prisma.websiteProject.findMany({
            where: { isPublished: true },
            include: { user: true }
        })
        if (!projects) {
            return res.status(404).json({ success: true, message: "Project not found" })
        }
        res.status(200).json({ success: true, projects })

    } catch (error: any) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getSingleProjectById = async (req: Request, res: Response) => {
    const { projectId } = req.params as { projectId: string }
    try {
        const project = await prisma.websiteProject.findFirst({
            where: { id: projectId },
            include: { user: true }
        })
        if (!project || project.isPublished === false || !project.current_code) {
            return res.status(404).json({ success: true, message: "Project not found" })
        }
        res.status(200).json({ success: true, code: project.current_code })

    } catch (error: any) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}
export const SaveProjectCode = async (req: Request, res: Response) => {
    const userId = req.userId
    const { projectId } = req.params as { projectId: string }
    const { code } = req.body
    try {
        if (!userId || !code) {
            return res.status(400).json({ success: false, message: !userId ? "Unauthorized" : "Code is required" })
        }
        const project = await prisma.websiteProject.update({
            where: { id: projectId, userId },
            data: {
                current_code: code,
                current_version_index: " "
            }
        })
        if (!project) {
            return res.status(404).json({ success: true, message: "Project does not exit to toggle" })
        }
        res.status(200).json({ success: true, message: "Project saved successfully" })

    } catch (error: any) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}


