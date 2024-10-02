import AMQPService from './rabbit-receiver';
import prisma from './prisma';

(async () => {
  const amqpService = await AMQPService.getInstance();
  
  await amqpService.consumeMessages(async (msg: any) => { // Adjust the type based on the actual message type from AMQP Service
    const message = msg.content.toString();
    const data: { problemId: string; codeSubmission: string; timestamp: Date; userId: string } = JSON.parse(message);

    const { problemId, codeSubmission, timestamp, userId } = data;

    await prisma.submission.create({
      data: {
        code: codeSubmission,
        language: 'JavaScript',
        result: 'Pending',
        userId: userId,
        problemId: problemId,
        createdAt: timestamp
      }
    });
  });
})();