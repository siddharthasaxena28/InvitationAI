import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['en', 'hi'],
  defaultLocale: 'en',
  localeDetection: false,
  localePrefix: 'never', // keep URLs as-is — no /en or /hi prefix
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
