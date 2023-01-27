export { default } from 'feelstatic/middleware';

export const config = {
  matcher: ['/feelstatic(.*)', '/api/feelstatic/((?!/auth).*)'],
};
