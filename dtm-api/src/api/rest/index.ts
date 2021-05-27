import express, { Express } from 'express'
import bodyParser from 'body-parser'
import config from 'config'
import routes from './routes'
import cors from 'cors'
import logger from 'logger'

export default () => {
    const app: Express = express()

    app.disable('x-powered-by')

    app.use(cors())

    //https://dtm.avalue.co.th/
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    routes(app)

    /* eslint-disable-next-line */
    app.use((error, request, response, next) => {
        if (error.message === 'nothing') {
            return
        }
        if (error.universal) {
            const status = error.status
            error.status = undefined
            error.amount = undefined
            error.universal = undefined
            response(status).json({error : [ { message: error.message, ...error } ] })
            return
        }
        throw error
    })

    app.listen(config.api.port, () => logger.getLogger('rest').info(`Server started at 0.0.0.0:${config.api.port}`))
}

