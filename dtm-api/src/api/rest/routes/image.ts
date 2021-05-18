import { Router, Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express'
import imageService from 'services/image'
import UniversalError from 'errors/UniversalError'
import withAuth, { CheckClientAuth } from 'api/rest/middlewares/withAuth'
import path from 'path'
import upload from 'multer/storage'

const router: Router = Router()

router.post('/uploadImage', withAuth, upload.single('images'), async (request: CheckClientAuth, response: ExpressResponse, next: NextFunction) => {
    try {
        const image = request['file']
        const accessToken = request.accessToken
        const upload = await imageService.uploadImage(accessToken, image)
        response.json(upload)
    }
    catch (error) {
        next(error)
    }
})

router.get('/getImage/:name', async(request: ExpressRequest, response: ExpressResponse, next: NextFunction) => {
    console.log('yes')

    const name = request.params.name
    console.log(name)

    const options = {
        root: path.join(__dirname, '../../../../uploads'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true,
            'Content-Type': 'image/png',
        },
    }
    response.sendFile(name, options, function (err) {
        if (err) {
            next(err)
        }
        else {
            console.log('Sent:', name)
        }
    })
})

router.get('/getImage', async (request: ExpressRequest, response: ExpressResponse, next: NextFunction) => {
    try {
        const errors = new UniversalError()
        const { query } = request
        console.log(query.imageId)

        if (!query.imageId) {
            errors.addError('empty/imageId', 'The imageId was empty')
        }

        if (errors.amount > 0) {
            throw errors
        }

        const imageData = await imageService.getImage(query.imageId)
        if (imageData) {
            const image = {
                id: imageData.data.id,
                fullPath: 'http' + '://' + request.get('host') + '/api/getImage/' + imageData.data.name,
            }

            response.json(image)
        }
        else {
            response.json({})
        }
    }
    catch (error) {
        next(error)
    }
})

export default router

