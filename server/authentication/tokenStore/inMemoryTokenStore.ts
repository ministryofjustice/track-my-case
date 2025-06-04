import { TokenStore } from './tokenStore'

export default class InMemoryTokenStore implements TokenStore {
  tokenMap = new Map<string, { token: string; expiry: Date }>()

  public async setToken(key: string, token: string, durationSeconds: number = 60 * 10): Promise<void> {
    this.tokenMap.set(key, { token, expiry: new Date(Date.now() + durationSeconds * 1000) })
    return Promise.resolve()
  }

  public async removeToken(key: string): Promise<void> {
    this.tokenMap.delete(key)
    return Promise.resolve()
  }

  public async getToken(key: string): Promise<string> {
    if (!this.tokenMap.has(key)) {
      return Promise.resolve(null)
    }
    if (this.tokenMap.get(key).expiry.getTime() < Date.now()) {
      await this.removeToken(key)
      return Promise.resolve(null)
    }
    return Promise.resolve(this.tokenMap.get(key).token)
  }

  public async incrementCount(key: string, windowSeconds: number): Promise<number> {
    if (!this.tokenMap.has(key) || this.tokenMap.get(key).expiry.getTime() < Date.now()) {
      await this.setToken(key, '1', windowSeconds)
      return Promise.resolve(1)
    }

    const count = parseInt(await this.getToken(key), 10) + 1
    await this.setToken(key, count.toString(), windowSeconds)
    return count
  }
}
