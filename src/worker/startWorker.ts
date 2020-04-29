import * as AMQP from "amqplib/callback_api";
import { v4 as uuidv4 } from 'uuid';
import { RedisManager } from '../manager/redisManager';
import { Message } from "../master/startMaster";
import { RabbitManager } from '../manager/rabbitManager';

export class Worker extends RabbitManager {

    protected queue: string;
    protected msg: string;
    protected amqp = AMQP;
    protected id:string;

    constructor() {
        super();
        this.queue = "queue";
        this.msg = "Hello word!";
        this.id = uuidv4(); 

        this.connectRabbit().then(async (connectionResult) => {
            this.connection = connectionResult;
            await this.getChannel().then(async (channelResult) => {
                this.channel = channelResult;
                this.assertQueueAndConsume();
            })
        });
    }

    public assertQueueAndConsume():void{
        this.channel.assertQueue(this.queue, {
            durable: true
        });
        this.channel.prefetch(1);

        console.log("the worker "+this.id+" is waiting for messages in %s. To exit press CTRL+C", this.queue);

        this.channel.consume(this.queue, (msg) => {  
            let result:Message = (JSON.parse(msg.content.toString()));
            console.log(result);

            if(result.type === "set"){
                RedisManager.getInstance().storeKey(result.key.toString(), result.body);
            }
            if(result.type === "get"){
                RedisManager.getInstance().getKey(result.key.toString());
            }
        
            setTimeout(() => {
                //console.log("the worker "+this.id+" has finished to process");
                this.channel.ack(msg);
            }, 2000);
            }, {
                noAck: false
        });
    }

}

const redis = new RedisManager();

const worker = new Worker();