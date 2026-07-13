import { createNunjucksEnv, baseContext, renderPage } from '../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = renderPage(env, 'pages/signed-out.njk', {
    ...baseContext,
    pageTitle: 'Signed out',
    ...{ correctPasswordAndNotExpired: true, authenticated: true },
  })
  expect(html).toMatchSnapshot()
})
