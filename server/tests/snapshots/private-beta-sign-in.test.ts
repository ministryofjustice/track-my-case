import { createNunjucksEnv, baseContext, renderPage } from '../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = renderPage(env, 'pages/private-beta-sign-in.njk', {
    ...baseContext,
    pageTitle: 'Enter service password',
    ...{ privateBetaSignInApi: '/private-beta-sign-in' },
  })
  expect(html).toMatchSnapshot()
})
