"use client";

import { usePathname, useRouter } from "next-intl/client";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div>
      <button onClick={() => switchLocale("en")} disabled={locale === "en"}>
        English
      </button>
      <button onClick={() => switchLocale("vi")} disabled={locale === "vi"}>
        Tiếng Việt
      </button>
    </div>
  );
}
