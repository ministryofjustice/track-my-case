import { createNunjucksEnv, baseContext } from '../../../utils/nunjucksTestHelper'

const env = createNunjucksEnv()
const ctx = { ...baseContext, correctPasswordAndNotExpired: true, authenticated: true, backLink: '/case/dashboard' }

it('court-information (active)', () => {
  expect(
    env.render('pages/case/court-information.njk', {
      ...ctx,
      pageTitle: 'Court information',
      selectedUrn: 'ABC123',
      hearingData: null,
      displayHearing: false,
      courtUrl: 'https://www.find-court-tribunal.service.gov.uk/',
    }),
  ).toMatchSnapshot()
})

it('court-information-not-found', () => {
  expect(
    env.render('pages/case/court-information-not-found.njk', {
      ...ctx,
      pageTitle: 'Not found - Court information',
      selectedUrn: 'ABC123',
      message: 'Not found',
    }),
  ).toMatchSnapshot()
})

it('court-information-access-denied', () => {
  expect(
    env.render('pages/case/court-information-access-denied.njk', {
      ...ctx,
      pageTitle: 'Access denied - Court information',
      message: 'Access denied',
    }),
  ).toMatchSnapshot()
})

it('court-information-common-platform-unavailable', () => {
  expect(
    env.render('pages/case/court-information-common-platform-unavailable.njk', {
      ...ctx,
      pageTitle: 'Common platform unavailable - Court information',
      message: 'Service down',
    }),
  ).toMatchSnapshot()
})

it('court-information-inactive', () => {
  expect(
    env.render('pages/case/court-information-inactive.njk', {
      ...ctx,
      pageTitle: 'No further court dates - Court information',
      message: 'Inactive',
    }),
  ).toMatchSnapshot()
})

it('court-information-no-hearings-allocated', () => {
  expect(
    env.render('pages/case/court-information-no-hearings-allocated.njk', {
      ...ctx,
      pageTitle: 'No hearings allocated - Court information',
      message: 'No hearings',
    }),
  ).toMatchSnapshot()
})
