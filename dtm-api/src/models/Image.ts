import { createSchema, Type, ExtractDoc, ExtractProps } from 'ts-mongoose'
import createModel from './createModel'

const schema = createSchema(
    {
        referenceId: Type.string({ require: true }),
        name: Type.string({ require: true }),
        imagePath: Type.string({ require: true }),
        mimetype: Type.string({ require: true }),
    },
    {
        timestamps: true,
    },
)

export const { model: Image } = createModel('Image', schema)
export const ImageSchema = schema
export type ImageDoc = ExtractDoc<typeof schema>
export type ImageProps = ExtractProps<typeof schema>
