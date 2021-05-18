import { Router, Request as ExpressRequest, Response as ExpressResponse, NextFunction, response } from 'express'
import userService from 'services/user'
import UniversalError from 'errors/UniversalError'
import withAuth, { CheckClientAuth } from 'api/rest/middlewares/withAuth'
import validator from 'validator'
import withToken from 'api/rest/middlewares/withToken'
import { ChannelToken } from 'models/ChannelToken'

const router: Router = Router()

router.post('/login', async (request, response: ExpressResponse, next: NextFunction) => {
    try {
        const errors = new UniversalError()
        const { body } = request

        if (!body.email) {
            errors.addError('empty/email', 'The email was empty')
        }

        if (!body.password) {
            errors.addError('empty/password', 'The password was empty')
        }

        if (errors.amount > 0) {
            throw errors
        }

        const user = await userService.login(body.email, body.password, body.lineUserId)
        response.json(user)
    }
    catch (error) {
        next(error)
    }
})

router.post('/register', async (request, response: ExpressResponse, next: NextFunction) => {
    try {
        const errors = new UniversalError()
        const { body } = request

        if (!body.firstName) {
            errors.addError('empty/firstName', 'The first name was empty')
        }

        if (!body.lastName) {
            errors.addError('empty/lastName', 'The last name was empty')
        }

        if (!body.email) {
            errors.addError('empty/email', 'The email was empty')
        }
        else if (body.email && !validator.isEmail(body.email)) {
            errors.addError('invalid/email', 'The email was invalid.')
        }
        else if (body.email && !await userService.checkDuplicateEmail(body.email)) {
            errors.addError('condition/email', 'The email was duplicated.')
        }

        if (!body.password) {
            errors.addError('empty/password', 'The password was empty')
        }
        else if (!body.confirmPassword) {
            errors.addError('empty/confirmPassword', 'The confirmPassword was empty')
        }
        else if (body.password !== body.confirmPassword) {
            errors.addError('condition/confirmPassword', 'The confirmPassword does not match')
        }

        if (!body.phoneNumber) {
            errors.addError('empty/phoneNumber', 'The phoneNumber was empty')
        }

        if (errors.amount > 0) {
            throw errors
        }

        const user = await userService.register(body, request.get('host'))

        response.json(user)
    }
    catch (error) {
        next(error)
    }
})

router.post('/password/change', withAuth, async (request: CheckClientAuth, response: ExpressResponse, next: NextFunction) => {
    try {
        const errors = new UniversalError()
        const { oldPassword, newPassword, confirmPassword } = request.body

        if (!oldPassword) {
            errors.addError('empty/oldPassword', 'The oldPassword was empty')
        }

        if (!newPassword) {
            errors.addError('empty/newPassword', 'The newPassword was empty')
        }

        if (!confirmPassword) {
            errors.addError('empty/confirmPassword', 'The confirmPassword was empty')
        }
        else if (newPassword !== confirmPassword) {
            errors.addError('condition/confirmPassword', 'The confirmPassword does not match')
        }

        if (errors.amount > 0) {
            throw errors
        }

        const result = await userService.changePassword(oldPassword, newPassword, request.userId)

        if (result) {
            response.json({
                successful: result,
                message: 'Change password success',
            })
        }
        else {
            response.json({
                successful: result,
                message: "Change password fail",
            })
        }
    }
    catch (error) {
        next(error)
    }
})

router.post('/refreshToken', async (request, response: ExpressResponse, next: NextFunction) => {
    try {
        const errors = new UniversalError()
        const { refreshToken } = request.body

        if (!refreshToken) {
            errors.addError('empty/refreshToken', 'The refreshToken was empty')
        }

        const token = await userService.getAuthFromRefreshToken(refreshToken)

        if (!token) {
            errors.addError('invalid/refreshToken', 'refresh token is invalid')
        }

        if (token.refreshTokenExpiresAt && token.refreshTokenExpiresAt < new Date()) {
            errors.addError('condition/refreshToken', 'refresh token has expired')
        }

        if (errors.amount > 0) {
            throw errors
        }

        response.json(token.authenticationToken)
    }
    catch (error) {
        next(error)
    }
})

router.post('/logout', withAuth, async (request: CheckClientAuth, response: ExpressResponse, next: NextFunction) => {
    try {
        console.log(request.headers.authorization)
        const logout = await userService.revokeTokenByAccessToken(request.headers.authorization.replace('Bearer ', ''), request.userId, request.body.pushToken)
        response.json(logout)
    }
    catch (error) {
        next(error)
    }
})

router.post('/verifyAccount/:token', async (request, response: ExpressResponse, next: NextFunction) => {
    try {
        const errors = new UniversalError()

        if (!request.params.token) {
            errors.addError('empty/token', 'The token was empty')
        }

        if (errors.amount > 0) {
            throw errors
        }

        const userVerifyAccount = await userService.verifyAccount(request.params.token)

        response.json(userVerifyAccount)
    }
    catch (error) {
        next(error)
    }
})

router.post('/resendVerify', async (request, response: ExpressResponse, next: NextFunction) => {
    try {
        const input = request.body
        const resend = await userService.resendVerifyEmail(input.email, request.get('host'))
        response.json(resend)
    }
    catch (error) {
        next(error)
    }
})

router.post('/password/forgot', async (request, response: ExpressResponse, next: NextFunction) => {
    try {
        const errors = new UniversalError()
        const { email } = request.body

        if (!email) {
            errors.addError('empty/email', 'The email was empty')
        }
        else if (email && !validator.isEmail(email)) {
            errors.addError('invalid/email', 'The email was invalid')
        }
        else if (email && !(await userService.checkExistEmail(email))) {
            errors.addError('condition/email', 'The email does not exist')
        }

        if (errors.amount > 0) {
            throw errors
        }

        const result = await userService.forgotPassword(email, request.get('host'))

        if (result) {
            response.json({
                successful: result,
                message: 'Sent email success',
            })
        }
        else {
            response.json({
                successful: result,
                message: 'Sent email fail',
            })
        }
    }
    catch (error) {
        next(error)
    }
})

router.post('/password/new/:token', async (request, response: ExpressResponse, next: NextFunction) => {
    try {
        const errors = new UniversalError()
        const { newPassword } = request.body

        if (!newPassword) {
            errors.addError('empty/newPassword', 'The newPassword was empty')
        }

        if (!request.params.token) {
            errors.addError('empty/token', 'The token was empty')
        }

        if (errors.amount > 0) {
            throw errors
        }

        const result = await userService.newPassword(newPassword, request.params.token)

        if (result) {
            response.json({
                successful: result,
                message: 'Set new password success',
            })
        }
        else {
            response.json({
                successful: result,
                message: 'Set new password fail',
            })
        }
    }
    catch (error) {
        next(error)
    }
})

router.get('/profile', withAuth, async (request: CheckClientAuth, response: ExpressResponse, next: NextFunction) => {
    try {
        const userInfo = await userService.getUser(request.accessToken)
        response.json(userInfo)
    }
    catch (error) {
        next(error)
    }
})

router.post('/addKycChannel', withAuth, async(request: CheckClientAuth, response: ExpressResponse, next: NextFunction) => {
    try {
        const kyc = await userService.updateKyc(request.accessToken, request.body.channel)
        response.json(kyc)
    }
    catch (error) {
        next(error)
    }
})

router.get('/platformGetUser', withToken, async(request, response: ExpressResponse, next: NextFunction) => {
    try {
        const { type } = request.body
        const errors = new UniversalError()
        const channelToken = await ChannelToken.findOne({ token: request.headers.token.toString() })

        type.forEach(element => {
            if (element === 'USER' && !channelToken.isAccessUser) {
                errors.addError('invalid/token', 'token is invalid')
            }
            if (element.match('MEMBER')) {
                const channel = element.split('/').pop()
                const isFound = channelToken.accessMember.find(el => el == channel)
                if (!isFound) {
                    errors.addError('invalid/token', 'token is invalid')
                }
            }
            if (element !== 'USER' && !element.match('MEMBER')) {
                errors.addError('invalid/type', 'type is invalid')
            }
        })
        if (errors.amount > 0) {
            throw errors
        }
        const user = await userService.platformGetUser(type)
        response.json(user)
    }
    catch (error) {
        next(error)
    }
})

export default router
