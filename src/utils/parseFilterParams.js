const parseFilter = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const isContactType = (type) => ['work', 'home', 'personal'].includes(type);
  if (isContactType(type)) return type;
};

const parseIsFavourite = (isFavourite) => {
  if (typeof isFavourite === 'string') {
    return isFavourite.toLowerCase() === 'true';
  }
  if (typeof isFavourite === 'boolean') {
    return isFavourite;
  }
};

export const parseFilterParams = (query) => {
  const { contactType, isFavorite } = query;

  const parsedContactType = parseFilter(contactType);
  const parsedIsFavorite = parseIsFavourite(isFavorite);

  return {
    contactType: parsedContactType,
    isFavorite: parsedIsFavorite,
  };
};
