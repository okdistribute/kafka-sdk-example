import { Ditto, init, IdentityOnlinePlayground } from '@dittolive/ditto'
import { ConsumerConfig, Kafka, logLevel } from 'kafkajs'
import { randomUUID } from 'crypto'

declare var process : {
    env: {
      NODE_ENV: string,
      APP_ID: string,
      TOKEN: string,
      TOPIC: string,
      ENDPOINT: string,
      CLIENT_ID: string
    }
  }

function startDitto(appID: string, token: string): Ditto {
    let identity: IdentityOnlinePlayground = {
        appID: appID,
        token: token,
        type: 'onlinePlayground'
    }

    let ditto = new Ditto(identity)
    ditto.startSync()
    return ditto
}


async function main() {
  await init();
  let ditto = startDitto(process.env.APP_ID, process.env.TOKEN);

  const kafka = new Kafka({
    clientId: process.env.CLIENT_ID,
    brokers: [process.env.ENDPOINT],
    //logLevel: logLevel.DEBUG
  })

  let config: ConsumerConfig = {
    groupId: randomUUID()
  };

  const consumer = kafka.consumer(config);

  // Consuming
  await consumer.connect();
  await consumer.subscribe({ topic: process.env.TOPIC, fromBeginning: true });
    
  let people = ditto.store.collection("people")

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });

      people.upsert({
        value: message.value?.toString()
      })
    },
  });
}

main();