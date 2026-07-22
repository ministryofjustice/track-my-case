const getLngParam = (language: string): string => {
  if (language === 'cy') {
    return '?lng=cy'
  }
  return ''
}

// eslint-disable-next-line import/prefer-default-export
export { getLngParam }
