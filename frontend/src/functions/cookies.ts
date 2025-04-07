/**
 * Retrieves the value of a cookie by its name.
 * This function only works for cookies that are not HttpOnly.
 *
 * @param name - The name of the cookie to retrieve.
 * @returns The value of the cookie, or an empty string if the cookie is not found.
 */
export const getCookieValue = (name: string): string => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
    return "";
  };