import resolvePath from './resolvePath'

describe('resolvePath', () => {
  it('replaces a single path param', () => {
    const result = resolvePath('/cases/:caseId/hearings', { caseId: 'abc123' })
    expect(result).toBe('/cases/abc123/hearings')
  })

  it('replaces multiple params', () => {
    const result = resolvePath('/users/:userId/orders/:orderId', {
      userId: 'u1',
      orderId: 'o2',
    })
    expect(result).toBe('/users/u1/orders/o2')
  })

  it('encodes values safely', () => {
    const result = resolvePath('/search/:query', { query: 'A&B/C' })
    expect(result).toBe('/search/A%26B%2FC')
  })
})
