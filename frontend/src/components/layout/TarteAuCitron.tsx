'use client';

import Script from 'next/script';

declare global {
  interface Window {
    tarteaucitronForceLanguage?: string;
    tarteaucitron?: {
      init: (options: Record<string, unknown>) => void;
      lang: Record<string, string>;
      services: Record<string, unknown>;
      job: string[];
      userInterface: {
        openPanel: () => void;
      };
    };
  }
}

export default function TarteAuCitron() {
  const initTarteAuCitron = () => {
    if (!window.tarteaucitron) return;

    window.tarteaucitronForceLanguage = 'fr';

    window.tarteaucitron.init({
      privacyUrl: '',

      bodyPosition: 'bottom',
      orientation: 'bottom',

      hashtag: '#tarteaucitron',
      cookieName: 'greenroots-consent',

      groupServices: true,
      showDetailsOnClick: true,
      serviceDefaultState: 'wait',

      showAlertSmall: false,
      cookieslist: true,

      closePopup: false,

      showIcon: false,

      adblocker: false,

      AcceptAllCta: true,
      DenyAllCta: true,

      highPrivacy: true,
      handleBrowserDNTRequest: false,

      removeCredit: true,

      moreInfoLink: false,
      mandatory: true,
    });

    window.tarteaucitron.services.testservice = {
      key: 'testservice',
      type: 'other',
      name: 'Service de test',
      needConsent: true,
      cookies: ['test-cookie'],
      js: function () {},
      fallback: function () {},
    };

    window.tarteaucitron.job = window.tarteaucitron.job || [];
    window.tarteaucitron.job.push('testservice');

    window.tarteaucitron.lang.acceptAll = 'Accepter';
    window.tarteaucitron.lang.denyAll = 'Refuser';
    window.tarteaucitron.lang.personalize = 'Personnaliser';
  };

  return (
    <Script
      src="/tarteaucitron/tarteaucitron.min.js"
      strategy="afterInteractive"
      onLoad={initTarteAuCitron}
    />
  );
}
