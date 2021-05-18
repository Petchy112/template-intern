import multer from 'multer'
import mkdirp from 'mkdirp'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        const dest = './uploads/'
        mkdirp.sync(dest)
        cb(null, dest)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.png')
    },
})

const upload = multer({ storage: storage })

export default upload
