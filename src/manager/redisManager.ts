import * as Redis from 'redis';

export class RedisManager {

    private static instance: RedisManager;
    protected redisClient: Redis.RedisClient;

    constructor(){
        this.redisClient = Redis.createClient({
            host: "localhost",
            port: 6379
        });
        this.createAndConnectRedis();
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

    public storeKey(key: string, value:string): Promise<void> {
      
        this.redisClient.connected ? console.log("connected"): console.log("not connected");

        return new Promise((resolve, reject)=>{

            this.redisClient.set(key, value, (err) => {
                err !== undefined ? resolve() : reject();
              });
        })
        
    }

    public getValue(key: string): Promise<string> {
        return new Promise((resolve, reject)=>{
            this.redisClient.get(key, (err, reply) => {
                err !== undefined ? resolve(reply) : reject();
              });
        })
    }
}