import * as Redis from 'redis';

export class RedisManager {

    private static instance: RedisManager;
    protected redisClient: Redis.RedisClient;

    constructor(){
        this.redisClient = Redis.createClient({
            host: "localhost",
            port: 6379
        });
    }

    public static getInstance(): RedisManager {
        if (!RedisManager.instance) {
            RedisManager.instance = new RedisManager();
        }

        return RedisManager.instance;
    }

    public createAndConnectRedis(): Promise<void> {

        return new Promise((resolve, reject) => {
            this.redisClient.on("connect", (err) => {
                resolve();    
            });
        });
    }

    public storeKey(key: string, value:string): void {
      
        this.redisClient.connected ? console.log("sono connesso"): console.log("non connesso");

        this.redisClient.set(key, value, (err) => {
            console.log("chiave inserita "+key)
          });
    }

    public getKey(key: string): void {
        this.redisClient.get(key, (err, reply) => {
            console.log(reply);
          });
    }
}