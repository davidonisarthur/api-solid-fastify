import 'dotenv/config'
import { z } from "zod"

const envSchema = z.object({
    NODE_ENV: z.enum(['production', 'development', 'test']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3333),
    POSTGRES_HOST: z.string().min(1).default('localhost'),
    POSTGRES_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
    POSTGRES_USER: z.string().min(1),
    POSTGRES_PASSWORD: z.string().min(1),
    POSTGRES_DB: z.string().min(1),
})

const _env = envSchema.safeParse(process.env)

if (_env.success == false) {
    console.error('invalid environment variables', z.treeifyError(_env.error))

    throw new Error('Invalid environment variables');
}

export const env = _env.data
