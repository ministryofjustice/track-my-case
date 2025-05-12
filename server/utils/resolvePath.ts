/**
 * Replace colon-prefixed path parameters with actual values.
 *
 * Example:
 *   resolvePath('/cases/:caseId/hearings', { caseId: '12345' })
 *   → '/cases/12345/hearings'
 */
export default function resolvePath(template: string, params: Record<string, string | number>): string {
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, encodeURIComponent(String(value))),
    template,
  )
}
