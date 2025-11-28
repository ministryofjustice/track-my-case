export type TokenStorePrefix = 'systemToken' | 'idToken' | 'rateLimit'

export interface TokenStore {
  setToken(key: string, token: string, durationMilliSeconds: number): Promise<void>
  removeToken(key: string): Promise<void>
  getToken(key: string): Promise<string>
  incrementCount(key: string, windowSeconds: number): Promise<number>
}
