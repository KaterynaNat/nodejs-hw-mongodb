import Contact from '../models/contact.js';

export const getFilteredContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
  userId,
}) => {
  try {
    const skip = page > 0 ? (page - 1) * perPage : 0;
    const contactQuery = Contact.find().where('userId').equals(userId);

    if (filter.contactType) {
      contactQuery.where('contactType').equals(filter.contactType);
    }

    if (filter.isFavorite) {
      contactQuery.where('isFavorite').equals(filter.isFavorite);
    }

    const [totalItems, data] = await Promise.all([
      Contact.countDocuments(contactQuery),
      contactQuery
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(perPage),
    ]);

    const totalPages = Math.ceil(totalItems / perPage);

    return {
      data,
      page,
      perPage,
      totalItems,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: totalPages > page,
    };
  } catch (error) {
    console.log(error.message);
  }
};

export const countContacts = async (filter) => {
  return await Contact.countDocuments(filter);
};

export const getContactById = async (id, userId) => {
  return await Contact.findOne({ _id: id, userId });
};

export const addContact = async (data) => {
  return await Contact.create(data);
};

export const updateContact = async (id, userId, data) => {
  return await Contact.findOneAndUpdate({ _id: id, userId }, data, {
    new: true,
  });
};

export const deleteContact = async (id, userId) => {
  return await Contact.findOneAndDelete({ _id: id, userId });
};
