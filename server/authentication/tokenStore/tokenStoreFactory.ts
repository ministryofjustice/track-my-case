import config from '../../config'
import InMemoryTokenStore from './inMemoryTokenStore'
import { TokenStore, TokenStorePrefix } from './tokenStore'

const inMemoryStore = new InMemoryTokenStore()

/* eslint-disable @typescript-eslint/no-unused-vars */
const tokenStoreFactory = (prefix: TokenStorePrefix = 'systemToken'): TokenStore => {
  if (config.redis.enabled) {
    // return new RedisTokenStore(createRedisClient(), prefix)
  }

  return inMemoryStore
}

export default tokenStoreFactory
