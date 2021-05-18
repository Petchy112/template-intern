import { UserAuthToken } from 'models/UserAuthToken'
import { User, UserDoc } from 'models/User'
import { Email, SendEmailType } from 'models/Email'
import emailService from 'services/email'
import { generatePasswordHash, verifyPasswordHash } from 'helpers/passwordHash'
import logger from 'logger'
import UniversalErrorForRoute from 'errors/UniversalErrorForRoute'
import UniversalError from 'errors/UniversalError'
import jwt from 'jsonwebtoken'
import config from 'config'
import { ChannelToken } from 'models/ChannelToken'
import { response } from 'express'
import axios from 'axios'
import { ClientConfig, Client, middleware, MiddlewareConfig, WebhookEvent, TextMessage, MessageAPIResponseBase } from '@line/bot-sdk'

const log = logger.getLogger('services/user')

export interface AuthenticationToken {
    successful: boolean
    accessToken: string
    refreshToken: string
}

export interface User {
    id: string
    username: string
}

export interface UserInfo {
    successful: boolean
    id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    isVerify: boolean
    kyc: Array<String>
}

export interface Response {
    successful: boolean
    message: string
}

const thisService = {
    async login (email: string, password: string, lineUserId: string): Promise<AuthenticationToken> {
        log.debug('admin login called', email)

        const errors = new UniversalErrorForRoute()

        const user = await User.findOne({ email })

        if (user) {
            const passwordCheckHashResult = await verifyPasswordHash(user.passwordHash, password)

            console.log(passwordCheckHashResult)
            if (!passwordCheckHashResult) {
                errors.addError('err', 'The password was invalid')
                throw errors
            }

            if (!user.isVerify) {
                errors.addError('err', 'This account is not verify')
                throw errors
            }

            if (lineUserId) {
                const haveLineUserId = await User.findOne({ lineUserId })

                if (!haveLineUserId) {
                    user.lineUserId = lineUserId
                    await user.save()
                }
            }

            const signOptionsAccessToken = {
                ...config.session.jwt,
                expiresIn: config.auth.expires.accessToken,
            }

            const signOptionsRefreshToken = {
                ...config.session.jwt,
                expiresIn: config.auth.expires.refreshToken,
            }

            const payloadAccessToken = {
                userId: user.id,
                accessToken: 'ACCESS_TOKEN',
                email: user.email,
                phoneNumber: user.phoneNumber,
                isVerify: user.isVerify,
            }

            const payloadRefreshToken = {
                userId: user.id,
                refreshToken: 'REFRESH_TOKEN',
                email: user.email,
                phoneNumber: user.phoneNumber,
                isVerify: user.isVerify,
            }

            const expiresIn = config.auth.expires.accessToken

            const accessTokenExpiresAt = new Date()
            accessTokenExpiresAt.setSeconds(accessTokenExpiresAt.getSeconds() + expiresIn)

            const expire = config.auth.expires.refreshToken

            const refreshTokenExpiresAt = new Date()
            refreshTokenExpiresAt.setSeconds(refreshTokenExpiresAt.getSeconds() + expire)

            const accessToken = jwt.sign(payloadAccessToken, config.session.key.private, signOptionsAccessToken)
            const refreshToken = jwt.sign(payloadRefreshToken, config.session.key.private, signOptionsRefreshToken)

            const createUserAuthToken = new UserAuthToken()
            createUserAuthToken.userId = user.id
            createUserAuthToken.accessToken = accessToken
            createUserAuthToken.accessTokenExpiresAt = accessTokenExpiresAt
            createUserAuthToken.refreshToken = refreshToken
            createUserAuthToken.refreshTokenExpiresAt = refreshTokenExpiresAt
            await createUserAuthToken.save()

            const responseData = {
                successful: true,
                accessToken,
                refreshToken,
            }

            return responseData
        }
        else {
            errors.addError('invalid/account', 'The account was invalid')
            throw errors
        }
    },
    async register (input, host): Promise<{successful: boolean, message: String, }> {
        log.debug('register called', input)
        const {
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            lineUserId,
        }: {
            email: string
            password: string
            firstName: string
            lastName: string
            phoneNumber: string
            lineUserId: string
        } = input || {}

        const isExist = await User.findOne({ email: email })
        if (isExist) {
            return { successful: false, message: 'This email is already use.' }
        }


        const user = new User()
        user.email = email
        user.passwordHash = await generatePasswordHash(password)
        user.firstName = firstName
        if (lineUserId) {
            user.lineUserId = lineUserId
        }
        user.lastName = lastName
        user.phoneNumber = phoneNumber
        await user.save()

        const signOptionsEmailToken = {
            ...config.session.jwt,
            expiresIn: config.email.expires.token,
        }

        const payloadEmailToken = {
            userId: user.id,
            emailToken: 'VERIFY_TOKEN',
        }

        const expiresIn = config.email.expires.token

        const emailTokenExpiresAt = new Date()
        emailTokenExpiresAt.setSeconds(emailTokenExpiresAt.getSeconds() + expiresIn)

        const emailToken = jwt.sign(payloadEmailToken, config.session.key.private, signOptionsEmailToken)

        const info = {
            userId: user.id,
            email,
            type: 'VERIFY_ACCOUNT',
            token: emailToken,
            tokenExpiresAt: emailTokenExpiresAt,
        }

        await emailService.sendEmail(info, host)

        if (user) {
            return { successful: true, message: 'Registered!' }
        }

        return { successful: false, message: 'Oops! some thing wrong' }
    },
    async checkDuplicateEmail (username) {
        log.debug('checkDuplicateEmail called', username)

        const userQuery = await User.findOne({ username })
        if (userQuery) {
            return false
        }
        return true
    },
    async checkExistEmail (email: string): Promise<boolean> {
        log.debug('checkExistEmail called', email)

        const userQuery = await User.findOne({ email: email })
        if (userQuery) {
            return true
        }
        return false
    },
    async changePassword (oldPassword: string, newPassword: string, userId: string): Promise<Boolean> {
        log.debug('changePassword called')
        const errors = new UniversalError()

        const existUser = await User.findById(userId)
        if (existUser) {
            if (!await verifyPasswordHash(existUser.passwordHash, oldPassword)) {
                errors.addError('invalid/oldPassword', 'The oldPassword was invalid')
                throw errors
            }
            existUser.passwordHash = await generatePasswordHash(newPassword)
            await existUser.save()
            return true
        }
        return false
    },
    async getAuthFromRefreshToken (refreshToken: string): Promise<{ accessTokenExpiresAt: Date, refreshTokenExpiresAt: Date, authenticationToken: AuthenticationToken, }> {
        log.debug('getAuthFromRefreshToken called', refreshToken)
        const errors = new UniversalError()

        const userAuthToken = await UserAuthToken.findOne({ refreshToken })

        if (userAuthToken) {
            if (userAuthToken.refreshTokenExpiresAt && userAuthToken.refreshTokenExpiresAt < new Date()) {
                errors.addError('condition/refreshToken', 'refresh token has expired')
                throw errors
            }

            const user = await User.findOne({ _id: userAuthToken.userId })
            const signOptionsAccessToken = {
                ...config.session.jwt,
                expiresIn: config.auth.expires.accessToken,
            }

            const signOptionsRefreshToken = {
                ...config.session.jwt,
                expiresIn: config.auth.expires.refreshToken,
            }

            const payloadAccessToken = {
                userId: user.id,
                accessToken: 'ACCESS_TOKEN',
            }

            const payloadRefreshToken = {
                userId: user.id,
                refreshToken: 'REFRESH_TOKEN',
            }

            const expiresIn = config.auth.expires.accessToken

            const accessTokenExpiresAt = new Date()
            accessTokenExpiresAt.setSeconds(accessTokenExpiresAt.getSeconds() + expiresIn)

            const expire = config.auth.expires.refreshToken

            const refreshTokenExpiresAt = new Date()
            refreshTokenExpiresAt.setSeconds(refreshTokenExpiresAt.getSeconds() + expire)

            const accessToken = jwt.sign(payloadAccessToken, config.session.key.private, signOptionsAccessToken)
            const getRefreshToken = jwt.sign(payloadRefreshToken, config.session.key.private, signOptionsRefreshToken)

            const responseData = {
                successful: true,
                accessToken,
                refreshToken: getRefreshToken,
                message: null,
                email: null,
            }

            const createUserAuthToken = new UserAuthToken()
            createUserAuthToken.userId = user.id
            createUserAuthToken.accessToken = accessToken
            createUserAuthToken.accessTokenExpiresAt = accessTokenExpiresAt
            createUserAuthToken.refreshToken = getRefreshToken
            createUserAuthToken.refreshTokenExpiresAt = refreshTokenExpiresAt
            await createUserAuthToken.save()

            return {
                accessTokenExpiresAt,
                refreshTokenExpiresAt,
                authenticationToken: responseData,
            }
        }
        else {
            errors.addError('invalid/refreshToken', 'refresh token is invalid.')
            throw errors
        }
    },
    async revokeTokenByAccessToken (accessToken: string, userId: string, pushToken: string) {
        log.debug('revokeTokenByAccessToken called', accessToken)

        if (pushToken) {
            const tokens = [ pushToken ]
            const user = await User.findOne({ _id: userId })
            const pushTokenList = user.pushTokens.filter((value, index, self) => {
                return self.indexOf(value) === index
            })
            const pushTokens = pushTokenList.filter(id => {
                if (id) {
                    return tokens.indexOf(id) === -1
                }
            })

            await User.findOneAndUpdate({ _id: userId }, { pushTokens }, { new: true })
        }

        await UserAuthToken.findOneAndUpdate(
            { accessToken },
            { deleted: true },
            {
                new: true,
            },
        )

        const res = {
            successful: true,
            message: 'loged out!',
        }
        return res
    },
    async resendVerifyEmail (email: string, host: string): Promise<Boolean> {
        log.debug('resendEmailVerify called', email)

        const existUser = await User.findOne({ email: email, isVerify: false })
        if (existUser) {
            const signOptionsEmailToken = {
                ...config.session.jwt,
                expiresIn: config.email.expires.token,
            }

            const payloadEmailToken = {
                userId: existUser.id,
                emailToken: 'VERIFY_TOKEN',
            }

            const expiresIn = config.email.expires.token

            const emailTokenExpiresAt = new Date()
            emailTokenExpiresAt.setSeconds(emailTokenExpiresAt.getSeconds() + expiresIn)

            const emailToken = jwt.sign(payloadEmailToken, config.session.key.private, signOptionsEmailToken)

            const input = {
                userId: existUser.id,
                email,
                type: 'VERIFY_ACCOUNT',
                token: emailToken,
                tokenExpiresAt: emailTokenExpiresAt,
            }

            //await emailService.sendEmail(input, host)
            await emailService.sendEmail(input, host)

            return true
        }
        return false
    },
    async verifyAccount (token: string): Promise<Response> {
        log.debug('verifyAccount called', token)

        const errors = new UniversalError()
        const userEmail = await Email.findOne({ token, isUsed: false })
        if (userEmail) {
            if (userEmail.tokenExpiresAt && userEmail.tokenExpiresAt < new Date()) {
                errors.addError('condition/token', 'token has expired')
                throw errors
            }

            const user = await User.findOne({ _id: userEmail.userId, isVerify: false })

            user.isVerify = true
            user.role.push('USER')
            userEmail.isUsed = true
            await user.save()
            await userEmail.save()

            return {
                successful: true,
                message: 'Account was verified!',
            }
        }
        else {
            errors.addError('invalid/token', 'token is invalid')
            throw errors
        }
    },
    async forgotPassword (email: string, host: string): Promise<Boolean> {
        log.debug('forgotPassword called', email)

        const existUser = await User.findOne({ email: email })
        if (existUser) {
            const signOptionsEmailToken = {
                ...config.session.jwt,
            }

            const payloadEmailToken = {
                userId: existUser.id,
                emailToken: 'EMAIL_TOKEN',
            }

            const expiresIn = config.email.expires.token

            const emailTokenExpiresAt = new Date()
            emailTokenExpiresAt.setSeconds(emailTokenExpiresAt.getSeconds() + expiresIn)

            const emailToken = jwt.sign(payloadEmailToken, config.session.key.private, signOptionsEmailToken)

            const input = {
                userId: existUser.id,
                email,
                type: 'FORGOT_PASSWORD',
                token: emailToken,
                tokenExpiresAt: emailTokenExpiresAt,
            }
            await emailService.sendEmail(input, host)
            return true
        }
        return false
    },
    async newPassword (newPassword, token): Promise<Boolean> {
        log.debug('newPassword called', newPassword, token)
        const errors = new UniversalError()

        const userEmail = await Email.findOne({ token, isUsed: false })
        if (userEmail) {
            const user = await User.findById(userEmail.userId)
            user.passwordHash = await generatePasswordHash(newPassword)
            userEmail.isUsed = true
            await user.save()
            await userEmail.save()
            return true
        }
        else {
            errors.addError('invalid/token', 'token is invalid')
            throw errors
        }
    },
    async getUser (accessToken: string): Promise<UserInfo> {
        log.debug('getUser called', accessToken)
        const userTokenData = await UserAuthToken.findOne({ accessToken })
        const user = await User.findOne({ _id: userTokenData.userId })
        const userInfo = {
            successful: true,
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            isVerify: user.isVerify,
            kyc: user.kyc,
        }
        return userInfo
    },
    async updateKyc (accessToken: string, channel: string): Promise<Boolean> {
        log.debug('changeKryStatus called', accessToken)
        const userTokenData = await UserAuthToken.findOne({ accessToken })
        const user = await User.findOne({ _id: userTokenData.userId })
        user.kyc.push(channel)
        if (!user.role.find(el => el === 'MEMBER')) {
            user.role.push('MEMBER')
        }
        await User.findOneAndUpdate({ _id: userTokenData.userId }, { kyc: user.kyc }, { new: true })

        return true
    },
    async platformGetUser (type) {
        log.debug('get user by role called', type)
        const user = await User.find()
        const res = {}
        type.forEach(element => {
            res[element] = []
            const preType = element.split('/').shift()
            user.forEach(us => {
                if (us.role.find(el => el === preType)) {
                    const userInfo = {
                        id: us.id,
                        firstName: us.firstName,
                        lastName: us.lastName,
                        email: us.email,
                        phoneNumber: us.phoneNumber,
                        isVerify: us.isVerify,
                    }
                    res[element].push(userInfo)
                }
            })
        })
        for (const [ key ] of Object.entries(res)) {
            if (key !== 'USER') {
                res['USER']= res['USER'].filter(function(cv) {
                    return !res[key].find(function(e) {
                        return e.id == cv.id
                    })
                })
            }
        }
        return res
    },
    async mapUserIdPushNoti() {
        const { data } = await axios.get(`${config.externalEndpoint}/all/badge`)
        const users = await User.find({ userId: { $in: data.userIds } })

        // axios.post('https://api.line.me/v2/bot/message/push',
        //     {
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Bearer {channel access token}',
        //     },
        //     {
        //         "to": 'U4af4980629...',
        //         "messages": [
        //             {
        //                 "type": "text",
        //                 "text": "Hello, world1",
        //             },
        //             {
        //                 "type": "text",
        //                 "text": "Hello, world2",
        //             },
        //         ],
        //     },
        // )

    },
    // async getSequenceNextValue(seqName) {
    //     const seqDoc = User.findOneAndUpdate(
    //         { _id: seqName },
    //         { $inc: { seqValue: 1 } },
    //         { new: true },
    //     )
    //     return seqDoc.seqValue
    // },
}

export default thisService
