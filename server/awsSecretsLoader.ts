import {
  GetSecretValueCommand,
  GetSecretValueCommandInput,
  GetSecretValueCommandOutput,
  SecretsManagerClient,
  SecretsManagerClientConfig,
} from '@aws-sdk/client-secrets-manager'
import { logger } from './logger'
import config from './config'

export const previewSecret = (str: string = ''): string => {
  if (!str) {
    return '(none)'
  }
  const manyStars = `****`
  const value: string = String(str)
  if (value.length <= 3) {
    return `${manyStars}`
  }
  if (value.length <= 6) {
    return `${value.slice(0, 2)}${manyStars}`
  }
  const minCharsToDisplay: number = 2
  return `${value.slice(0, minCharsToDisplay)}${manyStars}${value.slice(-minCharsToDisplay)}`
}

export type CachedSecrets = {
  OIDC_CLIENT_ID: string
  OIDC_PRIVATE_KEY: string
  SESSION_SECRET: string
}

const cachedSecretsStorage: { cachedSecretData?: CachedSecrets } = {
  cachedSecretData: undefined,
}

const getCachedSecrets = (): CachedSecrets => {
  const secretData: CachedSecrets = cachedSecretsStorage.cachedSecretData
  const { OIDC_CLIENT_ID, OIDC_PRIVATE_KEY, SESSION_SECRET } = secretData
  logger.info(`AWS Secrets Manager: found OIDC_CLIENT_ID ${previewSecret(OIDC_CLIENT_ID)}`)
  logger.info(`AWS Secrets Manager: found OIDC_PRIVATE_KEY ${previewSecret(OIDC_PRIVATE_KEY)}`)
  logger.info(`AWS Secrets Manager: found SESSION_SECRET ${previewSecret(SESSION_SECRET)}`)

  return { OIDC_CLIENT_ID, OIDC_PRIVATE_KEY, SESSION_SECRET }
}

export const loadAwsSecrets = async (): Promise<CachedSecrets> => {
  if (cachedSecretsStorage?.cachedSecretData) {
    logger.info(`AWS Secrets Manager: cached secrets found`)
    return getCachedSecrets()
  }

  try {
    const { enabled } = config.awsSecretManager
    if (!enabled) {
      logger.info(`AWS Secrets Manager: not enabled`)
      cachedSecretsStorage.cachedSecretData = {
        OIDC_CLIENT_ID: config.apis.govukOneLogin.clientId,
        OIDC_PRIVATE_KEY: config.apis.govukOneLogin.privateKey,
        SESSION_SECRET: config.session.secret,
      }
      return getCachedSecrets()
    }

    logger.info(`AWS Secrets Manager: loading secrets per environment`)

    const { awsSecretManagerName } = config.awsSecretManager
    logger.info(`AWS Secrets Manager: found TMC_AWS_SECRET_MANAGER_NAME ${awsSecretManagerName}`)

    const { awsRegion } = config.awsSecretManager
    logger.info(`AWS Secrets Manager: found TMC_AWS_REGION ${awsRegion}`)

    const secretsManagerClientConfig: SecretsManagerClientConfig = {
      region: awsRegion,
    }
    const secretsManagerClient = new SecretsManagerClient(secretsManagerClientConfig)

    const getSecretValueCommandInput: GetSecretValueCommandInput = {
      SecretId: awsSecretManagerName,
    }

    logger.info(`AWS Secrets Manager: query to SecretsManagerClient`)
    const secretValueCommandOutput: GetSecretValueCommandOutput = await secretsManagerClient.send(
      new GetSecretValueCommand(getSecretValueCommandInput),
    )
    logger.info(`AWS Secrets Manager: got GetSecretValueCommandOutput`)

    const secretData = JSON.parse(secretValueCommandOutput.SecretString)
    logger.info(`AWS Secrets Manager: got secretData`)

    cachedSecretsStorage.cachedSecretData = secretData

    return getCachedSecrets()
  } catch (e) {
    logger.error(`AWS Secrets Manager: failed to load ${e}`)
    throw new Error(`Missing env var ${e.message}`)
  }
}
