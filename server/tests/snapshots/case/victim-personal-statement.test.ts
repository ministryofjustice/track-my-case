import { createNunjucksEnv, baseContext, renderPage } from '../../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = renderPage(env, 'pages/case/victim-personal-statement.njk', {
    ...baseContext,
    pageTitle: 'Making a Victim Personal Statement',
    ...{ correctPasswordAndNotExpired: true, authenticated: true, backLink: '/case/dashboard' },
  })
  expect(html).toMatchSnapshot()
})
