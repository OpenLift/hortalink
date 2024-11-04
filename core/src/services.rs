use amqprs::BasicProperties;
use amqprs::callbacks::{DefaultChannelCallback, DefaultConnectionCallback};
use amqprs::channel::{BasicConsumeArguments, BasicPublishArguments, Channel, QueueBindArguments, QueueDeclareArguments};
use amqprs::connection::{Connection, OpenConnectionArguments};
use amqprs::consumer::DefaultConsumer;
use amqprs::error::Error;

use common::settings::Protocol;

pub struct AmqpManager {
    pub connection: Connection,
    pub channel: Channel,
}

impl AmqpManager {
    pub async fn new(settings: common::settings::services::RabbitMQ) -> Result<Self, Error> {
        let connection = Connection::open(
            &OpenConnectionArguments::try_from(settings.protocol_url().as_str()).unwrap()
        )
            .await?;
        connection.register_callback(DefaultConnectionCallback).await?;

        let channel = connection.open_channel(None).await?;
        channel.register_callback(DefaultChannelCallback).await?;

        Ok(Self {
            connection,
            channel,
        })
    }

    pub async fn declare_queue(&mut self, queue_name: &str) -> Result<(), Error> {
        let (_, _, _) = self.channel
            .queue_declare(QueueDeclareArguments::durable_client_named(queue_name))
            .await?
            .unwrap();
        Ok(())
    }

    pub async fn bind_queue(
        &mut self, 
        queue_name: &str, 
        exchange_name: &str, 
        routing_key: &str
    ) -> Result<(), Error> {
        self.channel
            .queue_bind(QueueBindArguments::new(queue_name, exchange_name, routing_key))
            .await?;
        Ok(())
    }

    pub async fn consume(
        &mut self, 
        queue_name: &str, 
        consumer_tag: &str
    ) -> Result<(), Error> {
        let args = BasicConsumeArguments::new(queue_name, consumer_tag);
        self.channel
            .basic_consume(DefaultConsumer::new(args.no_ack), args)
            .await?;
        Ok(())
    }

    pub async fn publish(
        &mut self, 
        exchange_name: &str, 
        routing_key: &str, 
        content: Vec<u8>
    ) -> Result<(), Error> {
        let args = BasicPublishArguments::new(exchange_name, routing_key);
        self.channel
            .basic_publish(BasicProperties::default(), content, args)
            .await?;
        Ok(())
    }
}