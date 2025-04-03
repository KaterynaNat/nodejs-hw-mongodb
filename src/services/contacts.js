import Contact from '../models/contact.js';

export const getFilteredContacts = async (filter, skip, limit, sort) => {
  return await Contact.find(filter).skip(skip).limit(limit).sort(sort);
};

export const countContacts = async (filter) => {
  return await Contact.countDocuments(filter);
};

export const getContactById = async (id) => {
  return await Contact.findById(id);
};

export const addContact = async (data) => {
  return await Contact.create(data);
};

export const updateContact = async (id, data) => {
  return await Contact.findByIdAndUpdate(id, data, { new: true });
};

export const deleteContact = async (id) => {
  return await Contact.findByIdAndDelete(id);
};
