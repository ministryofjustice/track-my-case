import { createNunjucksEnv, baseContext } from '../../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = env.render('pages/case/special-measures.njk', {
    ...baseContext,
    pageTitle: 'Special measures',
    ...{ correctPasswordAndNotExpired: true, authenticated: true, backLink: '/case/dashboard' },
  })
  expect(html).toMatchSnapshot()
})
