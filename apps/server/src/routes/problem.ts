import express, { json } from "express";
import prisma from '../prisma';  // Import the Prisma singleton instance
import AMQPService from "../rabbit-sender";

const problem = express.Router();

problem.get('/', async (req, res) => {
    const problems = await prisma.problem.findMany();
    res.json(problems);
});

problem.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const problem = await prisma.problem.findUnique({
            where: {
                id: id,
            },
            include: {
                testCases: {
                    select: {
                        id: true,
                        input: true,
                        output: true,
                    },
                },
            },
        });
        res.json(problem);
    } catch (e) {
        console.log(e);
    }
});

problem.post("/submit/:id", async (req, res) => {
    try {
        const { id } = req.params; // Get problem ID from URL
        const { code } = req.body;  // Get submitted code from request body

        // const problem = await prisma.problem.findUnique({
        //     where: {
        //         id: id,
        //     },
        // });
    
        // Message to be sent to the queue
        const message = JSON.stringify({
          problemId: id,
          codeSubmission: code,
          timestamp: new Date().toISOString()
        });
    
        // Get the singleton AMQP service instance and send the message to the queue
        const amqpService = await AMQPService.getInstance();
        await amqpService.sendToQueue(message);
    
        // Respond to the client
        res.status(200).send({ message: 'Code submitted successfully!', problemId: id });
      } catch (err) {
        console.error('Error submitting code:', err);
        res.status(500).send({ error: 'Failed to submit code' });
      }
});

export default problem;