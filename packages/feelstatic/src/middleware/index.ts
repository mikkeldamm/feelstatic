import { NextRequest, NextResponse } from 'next/server';

export default function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [username, password] = atob(authValue).split(':');
    if (username === (process.env.FST_USERNAME as string) && password === (process.env.FST_PASSWORD as string)) {
      return NextResponse.next();
    }
  }

  const url = req.nextUrl;
  url.pathname = '/api/feelstatic/auth';
  return NextResponse.rewrite(url);
}
