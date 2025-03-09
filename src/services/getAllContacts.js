import Contact from '../models/contact.js';

export async function getAllContacts(req, res) {
  const contacts = await Contact.find();
  return contacts;
}
