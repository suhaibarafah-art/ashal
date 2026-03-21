import { NextRequest, NextResponse } from 'next/server';

/**
 * Admin Protection — HTTP Basic Auth
 * Password is set via ADMIN_PASSWORD env var (default: SaudiLux2026Admin!)
 */
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (!path.startsWith('/admin')) return NextResponse.next();

  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Basic ')) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="SAUDILUX Admin Panel"' },
    });
  }

  const base64 = authHeader.split(' ')[1];
  const decoded = Buffer.from(base64, 'base64').toString('utf-8');
  const colonIdx = decoded.indexOf(':');
  const pass = decoded.substring(colonIdx + 1);

  const validPassword = process.env.ADMIN_PASSWORD ?? 'SaudiLux2026Admin!';

  if (pass !== validPassword) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="SAUDILUX Admin Panel"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
