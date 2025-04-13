const parseContactType = (type) => {
  const allowedTypes = ['work', 'home', 'personal'];
  return typeof type === 'string' && allowedTypes.includes(type)
    ? type
    : undefined;
};

const parseIsFavorite = (value) => {
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  if (typeof value === 'boolean') return value;
  return undefined;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavorite } = query;

  return {
    contactType: parseContactType(contactType),
    isFavorite: parseIsFavorite(isFavorite),
  };
};
