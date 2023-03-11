const parseSearch = (search: string) => {
  const [keyOrText, text] = search.split(': ') as [string, string | undefined];

  return {
    key: text !== undefined ? keyOrText : null,
    text: text === undefined ? keyOrText : text,
  } as const;
};

export default parseSearch;
