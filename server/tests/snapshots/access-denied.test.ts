import { createNunjucksEnv, baseContext } from '../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = env.render('pages/access-denied.njk', {
    ...baseContext,
    pageTitle: 'Access denied',
    ...{},
  })
  expect(html).toMatchSnapshot()
})
