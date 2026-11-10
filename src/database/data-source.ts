import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { env } from '../../env/index'

export const dataSource = new DataSource({
  type: 'postgres',
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  synchronize: false,
  migrationsRun: false,
  // Importar e registrar os EntitySchemas e as migrations aqui.
  entities: [],
  migrations: [],
})
