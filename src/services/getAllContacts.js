import Contact from '../models/contact.js';

export async function getAllContacts() {
  return await Contact.find();
}
