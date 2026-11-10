import type { FastifyInstance } from 'fastify'
import { dataSource } from './data-source'

export async function setupDatabase(app: FastifyInstance) {
    app.addHook('onClose', async () => {
        if (dataSource.isInitialized) {
            await dataSource.destroy()
        }
    })

    await dataSource.initialize()
}
