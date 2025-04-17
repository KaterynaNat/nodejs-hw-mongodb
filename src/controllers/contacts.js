import createError from 'http-errors';
import * as contactService from '../services/contacts.js';
import cloudinary from '../utils/cloudinary.js';
import { Readable } from 'stream';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { getFilteredContacts } from '../services/contacts.js';

export const getAllContacts = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getFilteredContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user.id,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactService.getContactById(contactId, req.user._id);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

function bufferToStream(buffer) {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

export const addContact = async (req, res) => {
  let photoUrl;
  if (req.file) {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'contacts' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      bufferToStream(req.file.buffer).pipe(uploadStream);
    });
    photoUrl = result.secure_url;
  }

  const newContact = await contactService.addContact({
    ...req.body,
    userId: req.user._id,
    photo: photoUrl,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;

  let photoUrl;
  if (req.file) {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'contacts' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      bufferToStream(req.file.buffer).pipe(uploadStream);
    });
    photoUrl = result.secure_url;
  }

  const updateData = {
    ...req.body,
  };

  if (photoUrl) {
    updateData.photo = photoUrl;
  }

  const updatedContact = await contactService.updateContact(
    contactId,
    req.user._id,
    updateData,
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
  const deleted = await contactService.deleteContact(contactId, req.user._id);

  if (!deleted) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
