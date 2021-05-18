import config from 'config'
import database from 'database'
import scanFile from 'libs/scanFile'
import path from 'path'
import logger from 'logger'

const runSeeder = async (folderPath: string) => {
    const filesName: string[] = await scanFile(folderPath)

    await Promise.all(
        filesName.filter(fileName => fileName.includes('.js') || fileName.includes('.ts')).map(async fileName => {
            const seeder: Function = require(path.join(folderPath, fileName)).default
            logger.getLogger('seeder').info(`Seeding ${folderPath.replace(__dirname, '')}/${fileName}`)
            await seeder()
        }),
    )
}

const run = async () => {
    await database()

    await runSeeder(path.join(__dirname, '/base'))

    await runSeeder(path.join(__dirname, `/${config.environment}`))

    logger.getLogger('seeder').info('Done')

    process.exit()
}

run()
