import Contact from '../models/contact.js';

export async function getContactById(id) {
  const contact = await Contact.findById(id);
  return contact;
}
