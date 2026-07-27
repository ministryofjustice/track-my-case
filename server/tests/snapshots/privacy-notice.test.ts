import { createNunjucksEnv, baseContext, renderPage } from '../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = renderPage(env, 'pages/privacy-notice.njk', {
    ...baseContext,
    pageTitle: 'Privacy notice',
    ...{},
  })
  expect(html).toMatchSnapshot()
})
