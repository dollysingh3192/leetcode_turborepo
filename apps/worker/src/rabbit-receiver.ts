import amqplib, { Connection, Channel, ConsumeMessage } from 'amqplib';

const QUEUE_NAME = 'judge';

class AMQPService {
  private static instance: AMQPService | null = null;
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  private constructor() {}

  // Singleton getInstance method
  public static async getInstance(): Promise<AMQPService> {
    if (!AMQPService.instance) {
      AMQPService.instance = new AMQPService();
      await AMQPService.instance.initialize();
    }
    return AMQPService.instance;
  }

  // Initialize the connection and channel
  private async initialize(): Promise<void> {
    try {
      this.connection = await amqplib.connect('amqp://localhost');
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(QUEUE_NAME, { durable: true });
    } catch (error) {
      console.error('Failed to initialize AMQP:', error);
      throw error;
    }
  }

  // Consume messages from the queue
  public async consumeMessages(onMessage: (msg: ConsumeMessage) => void): Promise<void> {
    if (this.channel) {
      console.log(`Waiting for messages in queue: ${QUEUE_NAME}`);
      await this.channel.consume(QUEUE_NAME, (msg: any) => {
        if (msg) {
          onMessage(msg);
          this.channel?.ack(msg); // Acknowledge that the message was processed
        }
      });
    } else {
      throw new Error('AMQP channel is not initialized');
    }
  }

  // Close the connection
  public async closeConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
    }
  }
}

// Use ES6 module export syntax
export default AMQPService;