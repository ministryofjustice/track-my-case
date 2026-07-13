import { createNunjucksEnv, baseContext } from '../../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()

it('matches snapshot', () => {
  const html = env.render('pages/case/requesting-court-hearing-transcript.njk', {
    ...baseContext,
    pageTitle: 'Requesting a court hearing transcript',
    ...{ correctPasswordAndNotExpired: true, authenticated: true, backLink: '/case/dashboard' },
  })
  expect(html).toMatchSnapshot()
})
