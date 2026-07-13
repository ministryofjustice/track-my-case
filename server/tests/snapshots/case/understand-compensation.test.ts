import { createNunjucksEnv, baseContext, renderPage } from '../../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = renderPage(env, 'pages/case/understand-compensation.njk', {
    ...baseContext,
    pageTitle: 'When you can claim compensation',
    ...{ correctPasswordAndNotExpired: true, authenticated: true, backLink: '/case/dashboard' },
  })
  expect(html).toMatchSnapshot()
})
