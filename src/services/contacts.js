import Contact from '../models/contact.js';

export const getFilteredContacts = async (filter, skip, limit, sort) => {
  return await Contact.find(filter).skip(skip).limit(limit).sort(sort);
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
