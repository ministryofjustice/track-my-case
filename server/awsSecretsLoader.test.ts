import { CachedSecrets, previewSecret } from './awsSecretsLoader'

describe('previewSecret', () => {
  it('returns (none) for undefined', () => {
    expect(previewSecret(undefined)).toBe('(none)')
  })

  it('returns (none) for empty string', () => {
    expect(previewSecret('')).toBe('(none)')
  })

  it('truncates strings of 1-3 chars', () => {
    expect(previewSecret('1')).toBe('****')
    expect(previewSecret('12')).toBe('****')
    expect(previewSecret('123')).toBe('****')
    expect(previewSecret('a')).toBe('****')
    expect(previewSecret('ab')).toBe('****')
    expect(previewSecret('abc')).toBe('****')
  })

  it('truncates strings of 4-6 chars', () => {
    expect(previewSecret('1234')).toBe('12****')
    expect(previewSecret('12345')).toBe('12****')
    expect(previewSecret('123456')).toBe('12****')
    expect(previewSecret('12.3')).toBe('12****')
    expect(previewSecret('12.34')).toBe('12****')
    expect(previewSecret('12.345')).toBe('12****')
    expect(previewSecret('abcd')).toBe('ab****')
    expect(previewSecret('abcde')).toBe('ab****')
    expect(previewSecret('abcdef')).toBe('ab****')
    expect(previewSecret('true')).toBe('tr****')
    expect(previewSecret('false')).toBe('fa****')
  })

  it('shows first and last 2 chars for longer strings', () => {
    expect(previewSecret('1234567')).toBe('12****67')
    expect(previewSecret('12345678')).toBe('12****78')
    expect(previewSecret('123456789')).toBe('12****89')
    expect(previewSecret('1234567890')).toBe('12****90')
    expect(previewSecret('secret-value')).toBe('se****ue')
    expect(previewSecret('secret-value-very-long')).toBe('se****ng')
    expect(previewSecret('secret-value-very-long-and-event-longer')).toBe('se****er')
  })
})

describe('loadAwsSecrets', () => {
  const mockSend = jest.fn()

  const awsSecrets: CachedSecrets = {
    OIDC_CLIENT_ID: 'aws-client-id',
    OIDC_PRIVATE_KEY: 'aws-private-key',
    SESSION_SECRET: 'aws-session-secret',
  }

  beforeEach(() => mockSend.mockReset())

  const getLoader = (enabled: boolean): (() => Promise<CachedSecrets>) => {
    jest.doMock('./logger', () => ({ logger: { info: jest.fn(), error: jest.fn() } }))
    jest.doMock('@aws-sdk/client-secrets-manager', () => ({
      SecretsManagerClient: jest.fn().mockImplementation(() => ({ send: mockSend })),
      GetSecretValueCommand: jest.fn().mockImplementation((input: unknown) => input),
    }))
    jest.doMock('./config', () => ({
      __esModule: true,
      default: {
        awsSecretManager: {
          enabled,
          awsSecretManagerName: 'my-secret',
          awsRegion: 'eu-west-2',
        },
        apis: {
          govukOneLogin: {
            clientId: 'config-client-id',
            privateKey: 'config-private-key',
          },
        },
        session: {
          secret: 'config-session-secret',
        },
      },
    }))
    // eslint-disable-next-line @typescript-eslint/no-require-imports, global-require
    return require('./awsSecretsLoader').loadAwsSecrets
  }

  describe('when AWS Secrets Manager is disabled', () => {
    it('returns secrets from config without calling AWS', async () => {
      let loadAwsSecrets!: () => Promise<CachedSecrets>
      jest.isolateModules(() => {
        loadAwsSecrets = getLoader(false)
      })

      const result = await loadAwsSecrets()

      expect(mockSend).not.toHaveBeenCalled()
      expect(result).toEqual({
        OIDC_CLIENT_ID: 'config-client-id',
        OIDC_PRIVATE_KEY: 'config-private-key',
        SESSION_SECRET: 'config-session-secret',
      })
    })
  })

  describe('when AWS Secrets Manager is enabled', () => {
    it('calls AWS with the configured secret name', async () => {
      mockSend.mockResolvedValue({ SecretString: JSON.stringify(awsSecrets) })
      let loadAwsSecrets!: () => Promise<CachedSecrets>
      jest.isolateModules(() => {
        loadAwsSecrets = getLoader(true)
      })

      await loadAwsSecrets()

      expect(mockSend).toHaveBeenCalledWith({ SecretId: 'my-secret' })
    })

    it('returns the parsed secrets from the AWS response', async () => {
      mockSend.mockResolvedValue({ SecretString: JSON.stringify(awsSecrets) })
      let loadAwsSecrets!: () => Promise<CachedSecrets>
      jest.isolateModules(() => {
        loadAwsSecrets = getLoader(true)
      })

      const result = await loadAwsSecrets()

      expect(result).toEqual(awsSecrets)
    })

    it('caches secrets and skips AWS on subsequent calls', async () => {
      mockSend.mockResolvedValue({ SecretString: JSON.stringify(awsSecrets) })
      let loadAwsSecrets!: () => Promise<CachedSecrets>
      jest.isolateModules(() => {
        loadAwsSecrets = getLoader(true)
      })

      await loadAwsSecrets()
      await loadAwsSecrets()

      expect(mockSend).toHaveBeenCalledTimes(1)
    })
  })

  describe('error handling', () => {
    it('throws a wrapped error when the AWS SDK fails', async () => {
      mockSend.mockRejectedValue(new Error('network timeout'))
      let loadAwsSecrets!: () => Promise<CachedSecrets>
      jest.isolateModules(() => {
        loadAwsSecrets = getLoader(true)
      })

      await expect(loadAwsSecrets()).rejects.toThrow('Missing env var network timeout')
    })
  })
})
