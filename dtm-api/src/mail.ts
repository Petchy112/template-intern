import config from 'config'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure, // true for 465, false for other ports
    auth: { // ข้อมูลการเข้าสู่ระบบ
        user: config.smtp.username, // email user ของเรา
        pass: config.smtp.password, // email password
    },
})

export default transporter
