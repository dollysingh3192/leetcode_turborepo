const AMQPService = require('./rabbit-receiver');
const prisma = require('./prisma');

(async () => {  
    const amqpService = await AMQPService.getInstance();
    await amqpService.consumeMessages(async (msg) => {
        
        const message = msg.content.toString();
        const data = JSON.parse(message);
        console.log(data);

        // Get the problem ID from the message
        const problemId = data.problemId;

        // Get the code submission from the message
        const codeSubmission = data.codeSubmission;

        // Get the timestamp from the message
        const timestamp = data.timestamp;

        prisma.submission.create({
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