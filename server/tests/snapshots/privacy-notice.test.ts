import { createNunjucksEnv, baseContext } from '../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = env.render('pages/privacy-notice.njk', {
    ...baseContext,
    pageTitle: 'Privacy notice',
    ...{},
  })
  expect(html).toMatchSnapshot()
})
