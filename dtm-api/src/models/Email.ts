import { createSchema, Type, ExtractDoc, ExtractProps } from 'ts-mongoose'
import createModel from './createModel'

export enum SendEmailType {
    VERIFY_ACCOUNT = 'VERIFY_ACCOUNT',
    FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

const schema = createSchema(
    {
        userId: Type.string(),
        email: Type.string(),
        title: Type.string(),
        message: Type.string(),
        token: Type.string({ require: false }),
        tokenExpiresAt: Type.date({ require: false }),
        type: Type.string({
            enum: Object.values(SendEmailType),
        }),
        isUsed: Type.boolean({ default: false }),
    },
    {
        timestamps: true,
    },
)

export const { model: Email } = createModel('Email', schema, { enableHardDelete: false })
export const EmailSchema = schema
export type EmailDoc = ExtractDoc<typeof schema>
export type EmailProps = ExtractProps<typeof schema>
