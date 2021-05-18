import mongoose from 'mongoose'
import config from 'config'
import logger from 'logger'

export default async () => {
    try {
        let connectionString = `mongodb://${config.database.host}:${config.database.port}/${config.database.database}`
        if (config.database.username) {
            connectionString = `mongodb://${config.database.username}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.database}`
        }
        await mongoose.connect (connectionString,
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
            },
        )

        logger.getLogger('database').info(`Database connection established. ${config.database.host}:${config.database.port} (dbName = ${config.database.database})`)
    }
    catch (error) {
        logger.getLogger('database').error(`Database connection could not established. ${config.database.host}:${config.database.port} (dbName = ${config.database.database})`, error)
        process.exit()
    }
}
