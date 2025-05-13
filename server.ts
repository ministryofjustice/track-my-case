import 'applicationinsights'

import app from './server/index'
import { logger } from './server/logger'
;(async () => {
  app.listen(app.get('port'), () => {
    const port = `${app.get('port')}`
    logger.info(`🚀 Server started on port ${port}`)
    logger.info(`  🔗 Track my case:  http://localhost:${port}`)
    logger.info(`  🏥 Health check:   http://localhost:${port}/health`)
    logger.info(`  🧪 Test service: http://localhost:${port}/case/court-info-health`)

    logger.info(`Press Ctrl+C to stop the server`)
    logger.info(`Environment: ${app.get('env')}`)
  })
})()
