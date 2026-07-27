import { RequestHandler } from 'express'

// eslint-disable-next-line import/prefer-default-export
export const setUpLaunchpadHeader: RequestHandler = (req, res, next) => {
  const currentLng = req.language?.split('-')[0] || 'en'

  const hrefOf = (code: string) => {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`)
    url.searchParams.set('lng', code)
    return url.toString()
  }

  res.locals.translations = {
    enabled: true,
    currentLanguageCode: currentLng,
    options: [
      { href: hrefOf('en'), code: 'en', label: 'English', changeLanguageText: 'Change the language to English' },
      { href: hrefOf('cy'), code: 'cy', label: 'Cymraeg', changeLanguageText: 'Newid yr iaith i’r Gymraeg' },
    ],
  }
  next()
}
