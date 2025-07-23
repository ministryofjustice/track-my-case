/* eslint-disable import/prefer-default-export */
import bunyan from 'bunyan'
import bunyanFormat from 'bunyan-format'
import config from './config'

const formatOut = bunyanFormat({ outputMode: 'short', color: !config.production })

const logger = bunyan.createLogger({ name: 'STG - Track My Case', stream: formatOut, level: 'debug' })

export { logger }
