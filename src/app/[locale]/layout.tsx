import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import SessionProvider from '@/components/SessionProvider';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const isRtl = locale === 'ar';

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SessionProvider>
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang="${locale}";document.documentElement.dir="${isRtl ? 'rtl' : 'ltr'}";` }} />
        {children}
      </SessionProvider>
    </NextIntlClientProvider>
  );
}
