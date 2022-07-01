import { createLogger , format, transports } from 'winston'

const Logger = createLogger({
    transports : [
        new transports.Console({
            level : 'debug',
            format : format.combine(
                format.simple(),
                format.timestamp(),
                format.printf(info => (
                    `${format.colorize({ all : true }).colorize('debug', `[${info.timestamp}][${info.level.toUpperCase()}] : `)} ${info.message}`
                ))
            )
        })
    ]
})

export default Logger