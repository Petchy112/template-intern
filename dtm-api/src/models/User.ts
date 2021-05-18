import { createSchema, Type, ExtractDoc, ExtractProps } from 'ts-mongoose'
import createModel from './createModel'

export enum Role {
    USER = 'USER',
    MEMBER = 'MEMBER',
    SECTION_SHARE = 'SECTION_SHARE',
    SPEAKER = 'SPEAKER',
    MC = 'MC'
}

const schema = createSchema(
    {
        userId: Type.string({ require: false }),
        email: Type.string({ require: true }),
        passwordHash: Type.string({ require: true }),
        firstName: Type.string({ require: true }),
        lastName: Type.string({ require: true }),
        lineUserId: Type.string({ require: false }),
        phoneNumber: Type.string({ require: true }),
        isVerify: Type.boolean({ default: false }),
        kyc: Type.array({ required: false, default: [] }).of(Type.string({ required: false })),
        pushTokens: Type.array({ required: false, default: [] }).of(Type.string({ required: false })),
        role: Type.array({ required: false, default: [], enum: Object.values(Role) }).of(Type.string()),
    },
    {
        timestamps: true,
    },
)

export const { model: User } = createModel('User', schema, { enableHardDelete: false })
export const UserSchema = schema
export type UserDoc = ExtractDoc<typeof schema>
export type UserProps = ExtractProps<typeof schema>
