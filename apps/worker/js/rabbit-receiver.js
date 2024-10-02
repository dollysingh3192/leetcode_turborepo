const amqplib = require('amqplib');

const QUEUE_NAME = 'judge';

class AMQPService {
  static instance;
  connection = null;
  channel = null;

  constructor() {}

  // Singleton getInstance method
  static async getInstance() {
    if (!AMQPService.instance) {
      AMQPService.instance = new AMQPService();
      await AMQPService.instance.initialize();
    }
    return AMQPService.instance;
  }

  // Initialize the connection and channel
  async initialize() {
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
  async consumeMessages(onMessage) {
    if (this.channel) {
      console.log(`Waiting for messages in queue: ${QUEUE_NAME}`);
      await this.channel.consume(QUEUE_NAME, (msg) => {
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
  async closeConnection(){
    if (this.connection) {
      await this.connection.close();
    }
  }
}

// Use CommonJS export syntax
module.exports = AMQPService;
