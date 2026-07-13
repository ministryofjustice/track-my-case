import { createNunjucksEnv, baseContext } from '../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = env.render('pages/private-beta-sign-in.njk', {
    ...baseContext,
    pageTitle: 'Enter service password',
    ...{ privateBetaSignInApi: '/private-beta-sign-in' },
  })
  expect(html).toMatchSnapshot()
})
