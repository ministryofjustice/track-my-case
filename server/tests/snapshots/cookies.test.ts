import { createNunjucksEnv, baseContext } from '../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = env.render('pages/cookies.njk', {
    ...baseContext,
    pageTitle: 'Cookies',
    ...{ cookieAccepted: 'rejected' },
  })
  expect(html).toMatchSnapshot()
})
