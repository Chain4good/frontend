import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  const safeLocale = locale || "en";

  try {
    const messages = (await import(`./messages/${safeLocale}.json`)).default;
    return {
      locale: safeLocale,
      messages,
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${safeLocale}`, error);
    return {
      locale: "en",
      messages: (await import("./messages/en.json")).default,
    };
  }
});
