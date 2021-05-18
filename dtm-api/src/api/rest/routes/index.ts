import { Express } from 'express'
import user from './user'
import image from './image'
import key from './key'

export default (app: Express) => {
    app.use('/api', [ user, image, key ])
}
