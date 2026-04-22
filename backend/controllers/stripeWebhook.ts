import { Request, Response } from "express";
import dotenv from "dotenv"
dotenv.config()
import Stripe from "stripe";
import { prisma } from "../configs/db.js";

export async function stripeWebHook(req: Request, res: Response) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string
    if (endpointSecret) {
        let event;
        const signature = req.headers['stripe-signature'] as string
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                endpointSecret
            );
            switch (event.type) {
                case 'payment_intent.succeeded':
                    const paymentIntent = event.data.object;
                    const sessionList = await stripe.checkout.sessions.list({
                        payment_intent: paymentIntent.id
                    })
                    const session = sessionList.data[0]
                    const { transactionId, appId } = session.metadata as { transactionId: string, appId: string }
                    if (appId === "Ai-Site-Builder" && transactionId) {
                        const transaction = await prisma.transaction.update({
                            where: { id: transactionId },
                            data: {
                                isPaid: true
                            }
                        })
                        await prisma.user.update({
                            where: { id: transaction.userId },
                            data: {
                                credits: { increment: transaction.credits }
                            }
                        })
                    }
                    break
                default:
                    console.log(`Unhandled event type ${event.type}.`);
            }
        } catch (err: any) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            return res.sendStatus(400);
        }
    }
}