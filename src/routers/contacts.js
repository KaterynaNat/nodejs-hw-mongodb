import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import * as contactsCtrl from '../controllers/contacts.js';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';

import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactSchemas.js';

const router = express.Router();

router.use(authenticate);

router.get('/', ctrlWrapper(contactsCtrl.getAllContacts));
router.get('/:contactId', isValidId, ctrlWrapper(contactsCtrl.getContactById));
router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(contactsCtrl.addContact),
);
router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(contactsCtrl.updateContact),
);
router.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactsCtrl.deleteContact),
);

export default router;
