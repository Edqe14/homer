const goTo = (url: string, params?: Record<string, string>) => {
  if (!url.startsWith('http')) {
    // eslint-disable-next-line no-param-reassign
    url = `https://${url}`;
  }

  const link = new URL(url);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    link.searchParams.set(key, value);
  });

  // eslint-disable-next-line no-restricted-globals
  location.href = link.href;
};

export default goTo;
