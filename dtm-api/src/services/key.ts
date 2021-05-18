import config from 'config'
import jwt from 'jsonwebtoken'
import logger from 'logger'
import { ChannelToken } from 'models/ChannelToken'
import { Role } from 'models/User'
export interface ChannelToken {
    name: string
    token: string
}

export interface PermissionType {
    role: Role
    channel: string
}

const log = logger.getLogger('services/key')

const thisService = {
    async generateKey(input): Promise<{successful: boolean, message: String, }> {
        log.debug(' called', input)

        const {
            name,
            permission,
        }: {
            name: string
            permission: PermissionType[]
        } = input || {}

        const isExist = await ChannelToken.findOne({ name: name })
        if (isExist) {
            return { successful: false, message: 'This channel is already generate token.' }
        }

        const signOptionsAccessToken = {
            ...config.session.jwt,
        }

        const payloadAccessToken = {
            type: name,
            accessToken: 'ACCESS_TOKEN',
        }

        const accessToken = jwt.sign(payloadAccessToken, config.session.key.private, signOptionsAccessToken)

        const channelToken = new ChannelToken()
        channelToken.name = name
        channelToken.token = accessToken
        permission.forEach(el => {
            if (el.role === 'USER') {
                channelToken.isAccessUser = true
            }
            else {
                channelToken.accessMember.push(el.channel)
            }
        })
        await channelToken.save()

        const responseData = {
            successful: true,
            message: 'Generate success.',
        }

        return responseData

    },
    // async reGenerateKey(input): Promise<{ successful: boolean, data: ImageDoc, }> {
    //     const image = await Image.findOne({ _id: id })
    //     return { successful: true, data: image }
    // },
}

export default thisService
