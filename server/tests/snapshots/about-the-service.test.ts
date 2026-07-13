import { createNunjucksEnv, baseContext, renderPage } from '../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = renderPage(env, 'pages/about-the-service.njk', {
    ...baseContext,
    pageTitle: 'About the Track a case service',
    ...{ correctPasswordAndNotExpired: true, authenticated: true, backLink: '/' },
  })
  expect(html).toMatchSnapshot()
})
