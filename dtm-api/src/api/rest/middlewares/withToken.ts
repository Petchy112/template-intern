import { Response, Request as ExpressRequest, NextFunction } from 'express'
import { ChannelToken } from 'models/ChannelToken'
import UniversalError from 'errors/UniversalError'

export default async (request: ExpressRequest, response: Response, next: NextFunction) => {
    try {
        const errors = new UniversalError()
        if (!request.body.type) {
            errors.addError('empty/type', 'The type of user was empty')
        }
        if (errors.amount > 0) {
            throw errors
        }
        else {
            const channelToken = await ChannelToken.findOne({ token: request.headers.token.toString() })
            if (!request.headers.token || !request.headers.token || !channelToken) {
                response.sendStatus(403)
                return
            }
            else {
                next()
            }
        }
    }
    catch (error) {
        next(error)
    }
}
