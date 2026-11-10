import { env } from "../env/index"
import {app} from "./app"
import { setupDatabase } from './database/setup-database'

async function start() {
    try {
        await setupDatabase(app)
        await app.listen({ host: '0.0.0.0', port: env.PORT })
        console.log('server running')
    } catch (error) {
        console.error(error)
        await app.close()
        process.exitCode = 1
    }
}

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.once(signal, () => {
        void app.close().catch((error) => {
            console.error(error)
            process.exitCode = 1
        })
    })
}

void start()
