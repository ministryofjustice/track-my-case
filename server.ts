import 'applicationinsights'

import app from './server/index'
import logger from './logger'

app.listen(app.get('port'), () => {
  logger.info(`🚀 Server started on port ${app.get('port')}`)
  logger.info(`  🔗 Track my case:  http://localhost:${app.get('port')}`)
  logger.info(`  🏥 Health check: http://localhost:${app.get('port')}/health`)
  logger.info(`  🧪 Test service: http://localhost:${app.get('port')}/case/court-info-health`)
  // logger.info(`Health:   http://localhost:${app.get('port')}/health`)
  // logger.info(`Healthz:  http://localhost:${app.get('port')}/healthz`)
  logger.info(`Press Ctrl+C to stop the server`)
  logger.info(`Environment: ${app.get('env')}`)
})
