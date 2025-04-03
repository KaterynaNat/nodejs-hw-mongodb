import createError from 'http-errors';
import * as contactService from '../services/contacts.js';

export const getAllContacts = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  const skip = (page - 1) * perPage;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const filter = {};
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavorite = isFavourite === 'true';

  const totalItems = await contactService.countContacts(filter);
  const contacts = await contactService.getFilteredContacts(
    filter,
    skip,
    perPage,
    sort,
  );
  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page: Number(page),
      perPage: Number(perPage),
      totalItems,
      totalPages,
      hasPreviousPage: Number(page) > 1,
      hasNextPage: Number(page) < totalPages,
    },
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactService.getContactById(contactId);
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const addContact = async (req, res) => {
  const newContact = await contactService.addContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await contactService.updateContact(
    contactId,
    req.body,
  );
  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const deleted = await contactService.deleteContact(contactId);
  if (!deleted) {
    throw createError(404, 'Contact not found');
  }
  res.status(204).send();
};
