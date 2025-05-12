export interface UpstreamHealth {
  status: 'UP' | 'DOWN'
  version: string
  checks?: unknown[]
}
