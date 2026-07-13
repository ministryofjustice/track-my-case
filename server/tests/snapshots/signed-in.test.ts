import { createNunjucksEnv, baseContext } from '../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = env.render('pages/signed-in.njk', {
    ...baseContext,
    pageTitle: 'Signed in',
    ...{ correctPasswordAndNotExpired: true, authenticated: true },
  })
  expect(html).toMatchSnapshot()
})
