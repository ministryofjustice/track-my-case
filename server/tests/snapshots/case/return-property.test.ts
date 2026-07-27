import { createNunjucksEnv, baseContext, renderPage } from '../../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = renderPage(env, 'pages/case/return-property.njk', {
    ...baseContext,
    pageTitle: 'Getting your property back',
    ...{ correctPasswordAndNotExpired: true, authenticated: true, backLink: '/case/dashboard' },
  })
  expect(html).toMatchSnapshot()
})
