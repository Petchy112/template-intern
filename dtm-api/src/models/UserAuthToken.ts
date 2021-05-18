import { createSchema, Type, ExtractDoc, ExtractProps } from 'ts-mongoose'
import createModel from './createModel'

const schema = createSchema(
    {
        userId: Type.string({
            require: true,
        }),
        accessToken: Type.string({
            require: false,
        }),
        accessTokenExpiresAt: Type.date({
            require: false,
        }),
        refreshToken: Type.string({
            require: false,
        }),
        refreshTokenExpiresAt: Type.date({
            require: false,
        }),
        forgotPasswordToken: Type.string({
            require: false,
        }),
        forgotPasswordTokenExpiresAt: Type.date({
            require: false,
        }),
    },
    {
        timestamps: true,
    },
)

export const { model: UserAuthToken } = createModel('UserAuthToken', schema, { enableHardDelete: false })
export const UserAuthTokenSchema = schema
export type UserAuthTokenDoc = ExtractDoc<typeof schema>
export type UserAuthTokenProps = ExtractProps<typeof schema>
