import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import * as contactsCtrl from '../controllers/contacts.js';

const router = express.Router();

router.get('/', ctrlWrapper(contactsCtrl.getAllContacts));
router.get('/:contactId', ctrlWrapper(contactsCtrl.getContactById));
router.post('/', ctrlWrapper(contactsCtrl.addContact));
router.patch('/:contactId', ctrlWrapper(contactsCtrl.updateContact));
router.delete('/:contactId', ctrlWrapper(contactsCtrl.deleteContact));

export default router;
