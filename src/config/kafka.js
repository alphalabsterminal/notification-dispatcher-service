const { Kafka } = require("kafkajs");
require("dotenv").config();

const kafka = new Kafka({
    clientId: "notification-dispatcher",
    brokers: [process.env.KAFKA_BROKER || "localhost:9092"]
});

const producer = kafka.producer();

module.exports = { kafka, producer };