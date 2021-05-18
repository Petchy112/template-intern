import mongooseDelete from 'mongoose-delete'
import mongooseHidden from 'mongoose-hidden'
import config from 'config'
import pluralize from 'pluralize'
import { typedModel, Extract } from 'ts-mongoose'
import { Schema, Model, Document } from 'mongoose'
import './extendModelTypes'

export default <T extends Schema>(modelName, schema: T, options: { hidden?: Object, enableHardDelete?: boolean, } = {}) => {
    // Use mongoose-delete plugin
    // Reference: https://github.com/dsanel/mongoose-delete
    if (!options.enableHardDelete) {
        schema.plugin(mongooseDelete, {
            overrideMethods: true,
        })
    }

    // Use mongoose-hidden plugin
    // Reference: https://github.com/mblarsen/mongoose-hidden
    schema.plugin(mongooseHidden(), {
        hidden: {
            _id: false,
            ...options.hidden,
        },
        virtuals: {
            fullname: 'hideJSON',
        },
    })

    const collectionName = config.database.collectionPrefix + '.' + pluralize(modelName.toLowerCase())
    const model = typedModel(modelName, schema, collectionName)

    return {
        model,
    }
}
