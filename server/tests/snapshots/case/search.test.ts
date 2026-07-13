import { createNunjucksEnv, baseContext, renderPage } from '../../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = renderPage(env, 'pages/case/enter-unique-reference-number.njk', {
    ...baseContext,
    pageTitle: 'Find your court',
    ...{ correctPasswordAndNotExpired: true, authenticated: true, backLink: '/case/dashboard' },
  })
  expect(html).toMatchSnapshot()
})
