type OpenGraphType = {
  siteName: string;
  description: string;
  templateTitle?: string;
  logo?: string;
};

/**
 * Generates an Open Graph URL with the provided parameters.
 *
 * @param {Object} params - The parameters for the Open Graph URL.
 * @param {string} params.siteName - The name of the site.
 * @param {string} params.description - The description of the site.
 * @param {string} [params.templateTitle] - The optional template title.
 * @param {string} [params.logo='https://localhost/images/logo.jpg'] - The optional logo URL.
 * @returns {string} The generated Open Graph URL.
 */
export function openGraph({
  siteName,
  templateTitle,
  description,
  logo = 'http://localhost:3000/images/logo.jpg',
}: OpenGraphType): string {
  const ogLogo = encodeURIComponent(logo);
  const ogSiteName = encodeURIComponent(siteName.trim());
  const ogTemplateTitle = templateTitle
    ? encodeURIComponent(templateTitle.trim())
    : undefined;
  const ogDesc = encodeURIComponent(description.trim());

  return `http://localhost:3000/api/general?siteName=${ogSiteName}&description=${ogDesc}&logo=${ogLogo}${
    ogTemplateTitle ? `&templateTitle=${ogTemplateTitle}` : ''
  }`;
}

/**
 * Retrieves a value from local storage by key.
 *
 * @param {string} key - The key of the item to retrieve.
 * @returns {string|null} The retrieved item or null if not found.
 */
export function getFromLocalStorage(key: string): string | null {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key);
  }
  return null;
}

/**
 * Retrieves a value from session storage by key.
 *
 * @param {string} key - The key of the item to retrieve.
 * @returns {string|null} The retrieved item or null if not found.
 */
export function getFromSessionStorage(key: string): string | null {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(key);
  }
  return null;
}
