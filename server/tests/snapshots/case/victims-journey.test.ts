import { createNunjucksEnv, baseContext } from '../../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = env.render('pages/case/victims-journey.njk', {
    ...baseContext,
    pageTitle: 'The criminal justice system: step by step',
    ...{ correctPasswordAndNotExpired: true, authenticated: true, backLink: '/case/dashboard' },
  })
  expect(html).toMatchSnapshot()
})
