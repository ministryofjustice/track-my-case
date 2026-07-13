import { createNunjucksEnv, baseContext } from '../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = env.render('pages/about-the-service.njk', {
    ...baseContext,
    pageTitle: 'About the Track a case service',
    ...{ correctPasswordAndNotExpired: true, authenticated: true, backLink: '/' },
  })
  expect(html).toMatchSnapshot()
})
