/* eslint-disable prettier/prettier */
import 'applicationinsights'

import trackMyCaseApp from './server/index'
import { logger } from './server/logger'
import { CachedSecrets, loadAwsSecrets } from './server/awsSecretsLoader'

;

(async () => {
  const awsSecrets: CachedSecrets = await loadAwsSecrets()
  const sessionSecret = awsSecrets.SESSION_SECRET

  const app = trackMyCaseApp(sessionSecret)

  app.listen(app.get('port'), () => {
    const port: string = `${app.get('port')}`
    logger.info(`🚀 Server started on port ${port}`)
    logger.info(`  🔗 Track a case:  http://localhost:${port}`)
    logger.info(`  🏥 Health check:   http://localhost:${port}/health`)

    logger.info(`Press Ctrl+C to stop the server`)
    const env: string = app.get('env')
    logger.info(`Environment: ${env}`)
  })
})()
