import { NextRequest, NextResponse } from 'next/server';

const pathsToRedirect = [
  '/school-classes',
  '/teachers',
  '/students',
  '/admissions',
];

//redirect to e.g '/school-classes/1' if user want to access 'classes'
export function handlePathRedirect(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathsToRedirect.includes(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = `${pathname}/1`;
    return NextResponse.redirect(url);
  }

  return null;
}
