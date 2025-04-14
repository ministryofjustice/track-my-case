import 'applicationinsights'

import app from './server/index'
import logger from './logger'

app.listen(app.get('port'), () => {
  logger.info(`Server started on port ${app.get('port')}`)
  logger.info(`/:  http://localhost:${app.get('port')}`)
  logger.info(`Health:   http://localhost:${app.get('port')}/health`)
  logger.info(`Healthz:  http://localhost:${app.get('port')}/healthz`)
  logger.info(`Press Ctrl+C to stop the server`)
  logger.info(`Environment: ${app.get('env')}`)
})
