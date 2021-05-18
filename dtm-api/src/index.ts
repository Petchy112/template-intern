import database from 'database'
import restAPI from 'api/rest'
import { EventEmitter } from 'events'
import { CronJob } from 'cron'

EventEmitter.defaultMaxListeners = 25

const run = async() => {
    await database()
    restAPI()
}

run()
