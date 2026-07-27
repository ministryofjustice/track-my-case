import { createNunjucksEnv, baseContext, renderPage } from '../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = renderPage(env, 'pages/cookies.njk', {
    ...baseContext,
    pageTitle: 'Cookies',
    ...{ cookieAccepted: 'rejected' },
  })
  expect(html).toMatchSnapshot()
})
