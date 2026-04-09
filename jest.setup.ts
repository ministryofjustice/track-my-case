/**
 * Env vars required by server/config.ts when test files import modules that load config at import time.
 */
process.env.TMC_PASSWORD = process.env.TMC_PASSWORD || 'test-password'
