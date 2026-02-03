import { CourtSitting, HearingDetails } from '../interfaces/caseDetails'
import { HEARING_TYPE, HearingStartDateMessage, HearingSummary } from '../interfaces/hearingSummary'

export const formatDate = (input?: string): string => {
  if (!input) return ''
  const date = new Date(input)
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export const formatDateTime = (input?: string): string => {
  if (!input) return ''
  const date = new Date(input)
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  })
}

export const calculateSittingPeriod = (sittingStart?: string, sittingEnd?: string): string => {
  if (!sittingStart || !sittingEnd) {
    return ''
  }

  const start = new Date(sittingStart)
  const end = new Date(sittingEnd)

  // Normalise to start of day (UTC to avoid DST issues)
  const startDay = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())
  const endDay = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate())

  if (endDay < startDay) {
    return ''
  }

  // Inclusive day count
  const diffDays = Math.floor((endDay - startDay) / (1000 * 60 * 60 * 24)) + 1

  return `${diffDays} day${diffDays > 1 ? 's' : ''}`
}

export const getHearingTypeMessage = (hearingType: string = '') => {
  if (!hearingType) {
    return 'Unknown'
  }
  if (HEARING_TYPE.TRIAL === hearingType) {
    return hearingType
  }
  if (HEARING_TYPE.SENTENCE === hearingType) {
    return 'Sentencing'
  }
  return hearingType
}

export const getHearingMessageOngoing = (hearingType: string): HearingStartDateMessage => {
  if (hearingType.startsWith(HEARING_TYPE.TRIAL)) {
    return {
      title: 'The trial is ongoing',
      description:
        'You do not need to go to the court unless you have been asked to give evidence. ' +
        'Your police witness care unit will keep you updated on the trial outcome.<br>' +
        'Be aware that trials can continue for more days than planned.',
    }
  }
  if (hearingType.startsWith(HEARING_TYPE.SENTENCE)) {
    return {
      title: 'The sentence hearing is ongoing',
      description:
        'You do not need to go to the court unless you have been asked to give evidence. ' +
        'Your police witness care unit will keep you updated on the trial outcome.<br>' +
        'Be aware that trials can continue for more days than planned.',
    }
  }
  return {
    title: `The ${hearingType.toLowerCase()} hearing is ongoing`,
    description:
      'Your police witness care unit will keep you updated on the trial outcome.<br>' +
      'Be aware that trials can continue for more days than planned.',
  }
}

export const getHearingMessageToday = (hearingType: string): HearingStartDateMessage => {
  if (hearingType.startsWith(HEARING_TYPE.TRIAL)) {
    return {
      title: 'The trial is due to start today',
      description:
        'You do not need to go to the court unless you have been asked to give evidence.<br>' +
        'Your police witness care unit will update you on the trial outcome. ' +
        'Be aware that trials can continue for more days than planned.',
    }
  }
  if (hearingType.startsWith(HEARING_TYPE.SENTENCE)) {
    return {
      title: 'The sentencing hearing is due to start today',
      description:
        'If you have told your police witness care unit you want to know the sentencing outcome, ' +
        'you have the right to be told within 5 working days of the sentencing.',
    }
  }
  return {
    title: `The ${hearingType.toLowerCase()} hearing is due to start today`,
    description: '',
  }
}

export const getHearingMessageTomorrow = (hearingType: string): HearingStartDateMessage => {
  if (hearingType.startsWith(HEARING_TYPE.TRIAL)) {
    return {
      title: 'The expected trial start date is tomorrow',
      description:
        'If you’re going to give evidence at the court, your police witness care unit will tell you ' +
        'where and when you need to be at the court. Remember if you are waiting for a call from them, ' +
        'their number might not show on your phone.',
    }
  }
  if (hearingType.startsWith(HEARING_TYPE.SENTENCE)) {
    return {
      title: 'The expected sentencing hearing date is tomorrow',
      description:
        'If you have said you want to hear the outcome, your police witness care unit should tell you ' +
        'within 5 working days of the sentencing.',
    }
  }
  return {
    title: `The expected ${hearingType.toLowerCase()} hearing date is tomorrow`,
    description: '',
  }
}

export const getHearingMessage2daysTo7days = (
  hearingType: string,
  monthsWeeksDays: string,
): HearingStartDateMessage => {
  if (hearingType.startsWith(HEARING_TYPE.TRIAL)) {
    return {
      title: `The expected trial start date is in ${monthsWeeksDays}`,
      description:
        'You do not need to go to the court unless you have been asked to give evidence. ' +
        'Make sure you have arranged time off work and childcare if needed.',
    }
  }
  if (hearingType.startsWith(HEARING_TYPE.SENTENCE)) {
    return {
      title: `The expected sentencing hearing is in ${monthsWeeksDays}`,
      description:
        'You can tell your police witness care unit if and how you want to be told of the sentencing outcome.',
    }
  }
  return {
    title: `The expected ${hearingType.toLowerCase()} hearing is in ${monthsWeeksDays}`,
    description: '',
  }
}

export const getHearingMessage8daysTo1month = (
  hearingType: string,
  monthsWeeksDays: string,
): HearingStartDateMessage => {
  if (hearingType.startsWith(HEARING_TYPE.TRIAL)) {
    return {
      title: `The expected trial start date is in ${monthsWeeksDays}`,
      description:
        'If you’re going to court to give evidence, you can get support to help you prepare. ' +
        '<a href="https://www.citizensadvice.org.uk/about-us/information/about-the-witness-service/" target="_blank">Find out about the Witness Service (opens in new tab)</a>.',
    }
  }
  if (hearingType.startsWith(HEARING_TYPE.SENTENCE)) {
    return {
      title: `The expected sentencing hearing date is in ${monthsWeeksDays}`,
      description:
        'You do not need to attend. You can tell your police witness care unit if and how you want to be told of the sentencing outcome.',
    }
  }
  return {
    title: `The expected ${hearingType.toLowerCase()} hearing date is in ${monthsWeeksDays}`,
    description: '',
  }
}

export const getHearingMessage1month1DayTo3months = (
  hearingType: string,
  monthsWeeksDays: string,
): HearingStartDateMessage => {
  if (hearingType.startsWith(HEARING_TYPE.TRIAL)) {
    return {
      title: `The expected trial start date is in ${monthsWeeksDays}`,
      description:
        "If you're going to court to give evidence, tell your police witness care unit if you have any additional needs. " +
        'They can make sure you get the right support.',
    }
  }
  if (hearingType.startsWith(HEARING_TYPE.SENTENCE)) {
    return {
      title: `The expected sentencing hearing date is in ${monthsWeeksDays}`,
      description:
        'You do not need to attend. You can tell your police witness care unit if and how you want to be told' +
        ' of the sentencing outcome.',
    }
  }
  return {
    title: `The expected ${hearingType.toLowerCase()} hearing date is in ${monthsWeeksDays}`,
    description: '',
  }
}

export const getHearingMessage3months1dayAndMore = (
  hearingType: string,
  monthsWeeksDays: string,
): HearingStartDateMessage => {
  if (hearingType.startsWith(HEARING_TYPE.TRIAL)) {
    return {
      title: 'If you’re going to court',
      description:
        'You do not need to go to the court unless you have been asked to give evidence.<br>' +
        'The exact court location might not be confirmed until the day of the trial. ' +
        'Your police witness care unit will tell you by phone call or text. ' +
        'Be aware the number they call from might not show on your phone, for example the number might be withheld.',
    }
  }
  if (hearingType.startsWith(HEARING_TYPE.SENTENCE)) {
    return {
      title: `The expected sentencing hearing date is in ${monthsWeeksDays}`,
      description:
        'You do not need to attend. You can tell your police witness care unit if and how you want to be told of the sentencing outcome.',
    }
  }
  return {
    title: `The expected ${hearingType.toLowerCase()} hearing date is in ${monthsWeeksDays}`,
    description: '',
  }
}

export const getHearingStartDateMessageFromDate = (
  hearingType: string,
  hearingStartDate: string,
  now: string,
): HearingStartDateMessage => {
  const fromStart = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  const today = fromStart(new Date(now))
  const hearingStart = fromStart(new Date(hearingStartDate))

  if (!today || !hearingStart) {
    return {
      title: `The expected ${hearingType.toLowerCase()} hearing date is in unknown`,
      description: '',
    }
  }

  if (hearingStart < today) {
    return getHearingMessageOngoing(hearingType)
  }
  if (hearingStart === today) {
    return getHearingMessageToday(hearingType)
  }
  let months = 0
  let cursor = today
  while (true) {
    const nextMonth = new Date(cursor)
    nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1)
    const nextStart = Date.UTC(nextMonth.getUTCFullYear(), nextMonth.getUTCMonth(), nextMonth.getUTCDate())
    if (nextStart > hearingStart) {
      break
    }
    months += 1
    cursor = nextStart
  }
  const daysAfterFullMonth = Math.floor((hearingStart - cursor) / (1000 * 60 * 60 * 24))
  const weeks: number = Math.floor(daysAfterFullMonth / 7)
  const days = daysAfterFullMonth - weeks * 7

  const parts: string[] = []
  if (months === 0) {
    // pattern: weeks and days, like: 3 weeks and 5 days
    if (weeks > 0) {
      parts.push(`${weeks} week${weeks !== 1 ? 's' : ''}`)
    }
    if (days > 0) {
      parts.push(`${days} day${days !== 1 ? 's' : ''}`)
    }
  } else {
    // pattern: months and days, no weeks, like: 1 month and 26 days
    parts.push(`${months} month${months !== 1 ? 's' : ''}`)
    if (daysAfterFullMonth > 0) {
      parts.push(`${daysAfterFullMonth} day${daysAfterFullMonth !== 1 ? 's' : ''}`)
    }
  }

  const monthsWeeksDays = `${parts.join(' and ')}`

  if (months === 0 && daysAfterFullMonth === 1) {
    // is tomorrow
    return getHearingMessageTomorrow(hearingType)
  }

  if (months === 0 && daysAfterFullMonth > 1 && daysAfterFullMonth <= 7) {
    // is within 1 week
    return getHearingMessage2daysTo7days(hearingType, monthsWeeksDays)
  }

  if ((months === 1 && daysAfterFullMonth === 0) || (months === 0 && daysAfterFullMonth > 7)) {
    // is within 1 month
    return getHearingMessage8daysTo1month(hearingType, monthsWeeksDays)
  }

  if ((months === 1 && daysAfterFullMonth > 0) || months === 2 || (months === 3 && daysAfterFullMonth === 0)) {
    // is within 3 months
    return getHearingMessage1month1DayTo3months(hearingType, monthsWeeksDays)
  }

  if (months > 3 || (months === 3 && daysAfterFullMonth > 0)) {
    // is over 3 months
    return getHearingMessage3months1dayAndMore(hearingType, monthsWeeksDays)
  }

  return {
    title: `The expected ${hearingType.toLowerCase()} hearing date is in ${monthsWeeksDays}`,
    description: '',
  }
}

export const getHearingStartDateMessage = (hearingType?: string, sittingStart?: string): HearingStartDateMessage => {
  if (!sittingStart || !hearingType) {
    return undefined
  }
  const todayIso = new Date().toISOString().slice(0, 10)
  return getHearingStartDateMessageFromDate(hearingType, sittingStart, todayIso)
}

const courtSittingsTimes = (courtSittings: CourtSitting[]) =>
  courtSittings
    .map(courtSitting => {
      return `${courtSitting.sittingStart} - ${courtSitting.sittingEnd}`
    })
    .join(', ')

export const mapCaseDetailsToHearingSummary = (hearing: HearingDetails): HearingSummary => {
  const sitting = hearing.courtSittings[0]
  const numberOfSittings = hearing.courtSittings?.length || 0
  const address = sitting?.courtHouse?.address

  return {
    hearingType: getHearingTypeMessage(hearing?.hearingType) ?? 'Unknown',
    sittingStart: formatDate(sitting?.sittingStart),
    sittingEnd: formatDate(sitting?.sittingEnd),
    sittingPeriod: `${numberOfSittings} day${numberOfSittings > 1 ? 's' : ''}`,
    sittingPeriodTooltip: courtSittingsTimes(hearing.courtSittings),
    hearingStartDateMessage: getHearingStartDateMessage(hearing?.hearingType, sitting?.sittingStart),
    location: {
      courtHouseName: sitting?.courtHouse?.courtHouseName ?? '',
      courtRoomName: undefined,
      addressLines: [
        address?.address1 ?? '',
        address?.address2 ?? '',
        address?.address3 ?? '',
        address?.address4 ?? '',
      ].filter(Boolean),
      postcode: address?.postalCode ?? '',
      country: address?.country ?? 'UK',
    },
  }
}
