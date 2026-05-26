import { redisStore } from 'cache-manager-redis-yet';
export const redisConfig = {
    isGlobal: true,
    useFactory: async () => {
        const store = await redisStore({
            ttl: 1000 * 60 * 60 * 24,
            socket: {
                host: process.env.Redis_Host,
                port: +process.env.Redis_PORT
            }
        })
        return { store }
    },
}
