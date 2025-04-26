export async function getMessages(locale, page) {
  try {
    const messages = await import(`../messages/${page}/${locale}.json`);
    return messages.default;
  } catch (error) {
    console.error("Error loading messages:", error);
    return {};
  }
}
