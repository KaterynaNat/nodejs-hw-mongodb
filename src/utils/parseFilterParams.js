const parseFilter = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const isContactType = (type) => ['work', 'home', 'personal'].includes(type);
  if (isContactType(type)) return type;
};

const parseIsFavorite = (isFavorite) => {
  if (typeof isFavorite === 'string') {
    return isFavorite.toLowerCase() === 'true';
  }
  if (typeof isFavorite === 'boolean') {
    return isFavorite;
  }
};

export const parseFilterParams = (query) => {
  const { contactType, isFavorite } = query;

  const parsedContactType = parseFilter(contactType);
  const parsedIsFavorite = parseIsFavorite(isFavorite);

  return {
    contactType: parsedContactType,
    isFavorite: parsedIsFavorite,
  };
};
