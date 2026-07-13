import { createNunjucksEnv, baseContext, renderPage } from '../../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = renderPage(env, 'pages/case/key-roles.njk', {
    ...baseContext,
    pageTitle: 'People in the criminal justice system',
    ...{ correctPasswordAndNotExpired: true, authenticated: true, backLink: '/case/dashboard' },
  })
  expect(html).toMatchSnapshot()
})
