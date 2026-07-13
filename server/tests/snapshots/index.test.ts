import { createNunjucksEnv, baseContext, renderPage } from '../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = renderPage(env, 'pages/index.njk', {
    ...baseContext,
    pageTitle: 'Home',
    ...{ currentTime: '2026-01-01T00:00:00.000Z' },
  })
  expect(html).toMatchSnapshot()
})
