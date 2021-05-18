import { Image, ImageDoc } from 'models/Image'
import { UserAuthToken } from 'models/UserAuthToken'
// import { User } from 'models/User'

import logger from 'logger'

const log = logger.getLogger('services/image')

const thisService = {
    async uploadImage(accessToken: string, imageData): Promise<{successful: boolean, data: ImageDoc, }> {
        log.debug('upload image called', accessToken)

        const userTokenData = await UserAuthToken.findOne({ accessToken })
        // const user = await User.findOne({ _id: userTokenData.userId })
        const image: ImageDoc = new Image()
        image.referenceId = userTokenData.userId
        image.name = imageData.filename
        image.imagePath = imageData.path
        image.mimetype = imageData.mimetype
        await image.save()
        return { successful: true, data: image }
    },
    async getImage(id): Promise<{ successful: boolean, data: ImageDoc, }> {
        const image = await Image.findOne({ _id: id })
        return { successful: true, data: image }
    },
}

export default thisService
