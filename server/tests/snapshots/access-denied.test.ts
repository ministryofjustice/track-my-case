import { createNunjucksEnv, baseContext, renderPage } from '../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = renderPage(env, 'pages/access-denied.njk', {
    ...baseContext,
    pageTitle: 'Access denied',
    ...{},
  })
  expect(html).toMatchSnapshot()
})
