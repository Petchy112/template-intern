import { createSchema, Type, ExtractDoc, ExtractProps } from 'ts-mongoose'
import createModel from './createModel'

const schema = createSchema(
    {
        name: Type.string({ require: true }),
        token: Type.string({ require: true }),
        isAccessUser: Type.boolean({ default: false }),
        accessMember: Type.array({ required: false, default: [] }).of(Type.string({ required: false })),
    },
    {
        timestamps: true,
    },
)

export const { model: ChannelToken } = createModel('ChannelToken', schema)
export const ChannelTokenSchema = schema
export type ChannelTokenDoc = ExtractDoc<typeof schema>
export type ChannelTokenProps = ExtractProps<typeof schema>
