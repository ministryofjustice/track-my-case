import { createNunjucksEnv, baseContext } from '../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = env.render('pages/index.njk', {
    ...baseContext,
    pageTitle: 'Home',
    ...{ currentTime: '2026-01-01T00:00:00.000Z' },
  })
  expect(html).toMatchSnapshot()
})
