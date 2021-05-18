import fs from 'fs'
import logger from 'logger'
import UniversalError from 'errors/UniversalError'
import { Router, Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express'
import keyService from 'services/key'

const router: Router = Router()

router.post('/generate', async (request, response: ExpressResponse, next: NextFunction) => {
    try {
        const errors = new UniversalError()
        const { body } = request

        if (!body.name) {
            errors.addError('empty/name', 'The name of platform was empty')
        }

        if (!body.permission) {
            errors.addError('empty/permission', 'The permission was empty')
        }

        if (errors.amount > 0) {
            throw errors
        }

        const user = await keyService.generateKey(body)
        response.json(user)
    }
    catch (err) {
        next(err)
    }
})

router.post('/revoke', async (request, response: ExpressResponse, next: NextFunction) => {
    try {
        fs.unlinkSync('keys/secret.pem')
        logger.getLogger('revoke apiKey').info('Done')
        response.json({ successful: true })
    }
    catch (err) {
        next(err)
    }
})

export default router
