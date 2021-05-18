/* eslint-disable @typescript-eslint/camelcase */
import merge from 'lodash.merge'
import fs from 'fs'

const environment = process.env.API_ENV || 'local'

const config = {
    environment,
    name: 'dtm',
    api: {
        port: 80,
    },
    database: {
        username: '',
        password: '',
        host: 'mongodb.dtm',
        port: 27017,
        database: 'dtm',
        collectionPrefix: 'dtm',
    },
    auth: {
        expires: {
            accessToken: 60 * 60,
            refreshToken: 7 * 24 * 60 * 60,
        },
    },
    email: {
        expires: {
            token: 5 * 60,
        },
    },
    session: {
        expires: {
            sessionToken: 60,
        },
        key: {
            private: fs.readFileSync('./keys/private.pem'),
            public: fs.readFileSync('./keys/public.pem'),
        },
        jwt: {
            issuer: 'dtm',
            algorithm: 'RS256',
        },
    },
    smtp: {
        email: '',
        host: '',
        port: '',
        secure: '',
        username: '',
        password: '',
    },
    externalEndpoint: 'https://uat.api.dta-badge.lffintech.co.th',
}

const runtimeConfig = {
    name: process.env['NAME'],
    api: {
        port: process.env['API_GRAPHQL_PORT'],
    },
    auth: {
        expires: {
            accessToken: process.env['AUTH_EXPIRES_ACCESS_TOKEN'],
            refreshToken: process.env['AUTH_EXPIRES_REFRESH_TOKEN'],
        },
        key: {
            private: process.env['AUTH_KEY_PRIVATE'],
            public: process.env['AUTH_KEY_PUBLIC'],
        },
        jwt: {
            issuer: process.env['AUTH_JWT_ISSUER'],
            algorithm: process.env['AUTH_JWT_ALGORITHM'],
        },
    },
    email: {
        expires: {
            token: process.env['EMAIL_EXPIRES_TOKEN'],
        },
    },
    session: {
        expires: {
            sessionToken: process.env['SESSION_EXPIRES_SESSION_TOKEN'],
        },
        key: {
            private: process.env['SESSION_KEY_PRIVATE'],
            public: process.env['SESSION_KEY_PUBLIC'],
        },
        jwt: {
            issuer: process.env['SESSION_JWT_ISSUER'],
            algorithm: process.env['SESSION_JWT_ALGORITHM'],
        },
    },
    database: {
        username: process.env['DATABASE_USERNAME'],
        password: process.env['DATABASE_PASSWORD'],
        host: process.env['DATABASE_HOST'],
        port: process.env['DATABASE_PORT'],
        database: process.env['DATABASE_NAME'],
        collectionPrefix: process.env['DATABASE_PREFIX'],
    },
    smtp: {
        email: process.env['SMTP_EMAIL'],
        host: process.env['SMTP_HOST'],
        port: process.env['SMTP_PORT'],
        secure: process.env['SMTP_SECURE'],
        username: process.env['SMTP_USERNAME'],
        password: process.env['SMTP_PASSWORD'],
    },
}

const environmentConfig = {
    local: {
        api: {
            port: 9000,
        },
        database: {
            // username: 'mongdUser',
            // password: 'XcV0trcvtS',
            // host: '159.65.134.212',
            host: 'localhost',
        },
        smtp: {
            email: '',
            host: '',
            port: '',
            secure: '',
            username: '',
            password: '',
        },
    },
    development: {
    },
    production: {
    },
}


const mergeConfig = (baseConfig, replaceConfig): void => {
    Object.keys(baseConfig).map(key => {
        if (replaceConfig[key] !== undefined) {
            if (baseConfig[key] instanceof Object) {
                baseConfig[key] = merge(baseConfig[key], replaceConfig[key])
            }
            else {
                baseConfig[key] = replaceConfig[key]
            }
        }
    })
}

mergeConfig(config, environmentConfig[environment])
mergeConfig(config, runtimeConfig)

export default config
