import { Response, Request as ExpressRequest, NextFunction } from 'express'
import { User } from 'models/User'
import { UserAuthToken } from 'models/UserAuthToken'

export interface CheckClientAuth extends ExpressRequest {
    accessToken: string
    accessTokenExpiresAt: Date
    refreshToken: string
    refreshTokenExpiresAt: Date
    userId: string
}

export default async (request: CheckClientAuth, response: Response, next: NextFunction) => {
    try {
        if (request.headers.authorization) {
            const token = request.headers.authorization.replace('Bearer ', '')
            const userTokenData = await UserAuthToken.findOne({ accessToken: token })
            if (userTokenData) {
                const userData = await User.findOne({ _id: userTokenData.userId })
                if (userData && userTokenData.accessTokenExpiresAt && userTokenData.accessTokenExpiresAt > new Date()) {
                    /* eslint-disable require-atomic-updates */
                    request.accessToken = userTokenData.accessToken
                    request.accessTokenExpiresAt = userTokenData.accessTokenExpiresAt
                    request.refreshToken = userTokenData.refreshToken
                    request.refreshTokenExpiresAt = userTokenData.refreshTokenExpiresAt
                    request.userId = userData.id
                    next()
                }
                else {
                    request.userId = null
                    next()
                }
            }
        }
        else {
            request.userId = null
            next()
        }
    }
    catch (error) {
        request.userId = null
        next()
    }
}
