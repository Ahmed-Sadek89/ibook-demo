export const langRedirection = (req, locale) => {
  
  const currentLang = req.cookies['NEXT_LOCALE'];

  const isNotCurrent = req.cookies && currentLang !== locale;

  let redirect = false;

  if(isNotCurrent) {
    if(currentLang === 'en') {
      redirect = req.url
    } else if (currentLang === 'ar') {
      redirect = `/${currentLang}/${req.url.startsWith("/") ? req.url.slice(1) : req.url}`
    }
  }

  if(redirect) {
    return {
      redirect: {
        destination: redirect,
        permanent: false
      }
    }
  }

  return false
}