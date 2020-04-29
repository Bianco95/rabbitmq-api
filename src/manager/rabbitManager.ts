import * as AMQP from "amqplib/callback_api";

export abstract class RabbitManager {

    protected connection: AMQP.Connection;
    protected channel: AMQP.Channel;
    protected amqp = AMQP;
    protected queue:string;

    constructor() {
        this.queue = "queue";

        this.connectRabbit().then(async (connectionResult) => {
            this.connection = connectionResult;
            await this.getChannel().then(async (channelResult) => {
                this.channel = channelResult;
            })
        });
    }

    public async connectRabbit(): Promise<AMQP.Connection> {
        return new Promise((resolve, reject) => {
            this.amqp.connect({ protocol: 'amqp', hostname: 'localhost', port: 5672 }, (error0, connection) => {
                if (error0) {
                    reject();
                } else {
                    resolve(connection);
                }
            });
        })
    }

    public async getChannel(): Promise<AMQP.Channel> {
        return new Promise((resolve, reject) => {
            this.connection.createChannel((error1, channel) => {
                if (error1) {
                    reject();
                } else {
                    resolve(channel);
                    this.channel = channel;
                }
            });
        })
    }

}