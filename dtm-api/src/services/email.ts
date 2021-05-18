import { Email, SendEmailType } from 'models/Email'
import { User } from 'models/User'
import mail from 'mail'
import config from 'config'
import logger from 'logger'
import getImagePath from 'helpers/getImagePath'
import verifyAccountTemplate from 'services/templates/verifyAccount'
import forgotPasswordTemplate from 'services/templates/forgotPassword'

const log = logger.getLogger('services/email')


const thisService = {
    async sendEmail (input, host): Promise<boolean> {
        log.debug('sendEmail called', input)

        const {
            userId,
            email,
            title,
            message,
            token,
            tokenExpiresAt,
            type,
            isUsed,
        }: {
            userId: string
            email: string
            title: string
            message: string
            token: string
            tokenExpiresAt: Date
            type: string
            isUsed: boolean
        } = input || {}

        if (type === SendEmailType.VERIFY_ACCOUNT) {
            const logoPath = getImagePath(host, 'logo.png')
            const urlVerifyAccount = `https://dtm.avalue.co.th/verifyEmail?token=${token}`
            const html = verifyAccountTemplate(logoPath, email, token, urlVerifyAccount)

            return await thisService.sendEmailEachType(input, html)
        }

        if (type === SendEmailType.FORGOT_PASSWORD) {
            const logoPath = getImagePath(host, 'logo.png')
            const urlNewPassword = `https://dtm.avalue.co.th/password/newPassword?token=${token}`
            const html = forgotPasswordTemplate(logoPath, email, token, urlNewPassword)

            return await thisService.sendEmailEachType(input, html)
        }
    },
    async sendEmailEachType (input, html): Promise<boolean> {
        log.debug('sendEmail called', input)

        const {
            userId,
            email,
            title,
            message,
            token,
            tokenExpiresAt,
            type,
            isUsed,
        }: {
            userId: string
            email: string
            title: string
            message: string
            token: string
            tokenExpiresAt: Date
            type: SendEmailType
            isUsed: boolean
        } = input || {}

        let subject = ''
        if (type == SendEmailType.FORGOT_PASSWORD) {
            subject = 'ลืมรหัสผ่าน'
        }

        if (type == SendEmailType.VERIFY_ACCOUNT) {
            subject = 'การยืนยันบัญชีผู้ใช้งาน'
        }

        await mail.sendMail({
            from: config.smtp.email,
            to: email,
            subject,
            html,
        })

        const emailInDB = new Email()
        emailInDB.userId = userId
        emailInDB.email = email
        emailInDB.title = title
        emailInDB.message = message
        emailInDB.token = token
        emailInDB.tokenExpiresAt = tokenExpiresAt
        emailInDB.type = type
        emailInDB.isUsed = false
        await emailInDB.save()

        return true
    },
}

export default thisService
