import { createNunjucksEnv, baseContext, renderPage } from '../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = renderPage(env, 'pages/signed-in.njk', {
    ...baseContext,
    pageTitle: 'Signed in',
    ...{ correctPasswordAndNotExpired: true, authenticated: true },
  })
  expect(html).toMatchSnapshot()
})
