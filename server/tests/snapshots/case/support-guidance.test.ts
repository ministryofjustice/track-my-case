import { createNunjucksEnv, baseContext } from '../../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = env.render('pages/case/support-guidance.njk', {
    ...baseContext,
    pageTitle: 'Where to get more support and information',
    ...{ correctPasswordAndNotExpired: true, authenticated: true, backLink: '/case/dashboard' },
  })
  expect(html).toMatchSnapshot()
})
