import { createNunjucksEnv, baseContext } from '../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = env.render('pages/signed-out.njk', {
    ...baseContext,
    pageTitle: 'Signed out',
    ...{ correctPasswordAndNotExpired: true, authenticated: true },
  })
  expect(html).toMatchSnapshot()
})
