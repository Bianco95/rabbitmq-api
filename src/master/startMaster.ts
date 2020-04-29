import { v4 as uuidv4 } from 'uuid';
import { resolve } from "dns";
import { timingSafeEqual } from "crypto";
import * as AMQP from "amqplib/callback_api";
import { RabbitManager } from '../manager/rabbitManager';

export interface Message{
    type: "get" | "set";
    key: number
    body: string;
}

export class Master extends RabbitManager{

    protected message: Message;
    protected messageCounter: number;

    constructor(protected name: string) {
        super();
        this.messageCounter = 0;

        this.connectRabbit().then(async (connectionResult) => {
            this.connection = connectionResult;
            await this.getChannel().then(async (channelResult) => {
                this.channel = channelResult;
                setInterval(()=>{
                    this.messageCounter+=1;
                    this.assertQueueAndSendMessage();
                },1000)
            })
        });
    }
    public assertQueueAndSendMessage(): void {

        let message:Message = {
            key: this.messageCounter,
            body: "body of the message"+this.messageCounter.toString(),
            type: "get"
        }

        this.channel.assertQueue(this.queue, {
            durable: true
        });

        this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(message)), {
            persistent: true

        });

        console.log(this.name + " Sent " + JSON.stringify(message,null,4) +this.messageCounter);
    }
}

let master = new Master("Master");
