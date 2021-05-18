import log4js from 'log4js'
import config from 'config'

log4js.configure({
    appenders: {
        out: {
            type: 'stdout',
            layout: {
                type: 'pattern',
                pattern: '%d [%x{applicationName}]-%[%p%] <%c> %m%n',
                tokens: {
                    applicationName: config.name,
                },
            },
        },
    },
    categories: {
        default: {
            appenders: [ 'out' ],
            level: 'all',
        },
    },
})

export default log4js
