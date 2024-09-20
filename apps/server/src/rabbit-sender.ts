import amqplib, { Connection, Channel } from 'amqplib';

const QUEUE_NAME = 'judge';

class AMQPService {
  private static instance: AMQPService;
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  private constructor() {}

  public static async getInstance(): Promise<AMQPService> {
    if (!AMQPService.instance) {
      AMQPService.instance = new AMQPService();
      await AMQPService.instance.initialize();
    }
    return AMQPService.instance;
  }

  private async initialize(): Promise<void> {
    if (!this.connection) {
      this.connection = await amqplib.connect('amqp://localhost:5672');
    }

    if (!this.channel) {
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(QUEUE_NAME, { durable: true });
    }
  }

  public async sendToQueue(message: string): Promise<void> {
    if (this.channel) {
      this.channel.sendToQueue(QUEUE_NAME, Buffer.from(message));
    } else {
      throw new Error('AMQP channel is not initialized');
    }
  }

  public async closeConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
    }
  }
}

export default AMQPService;
