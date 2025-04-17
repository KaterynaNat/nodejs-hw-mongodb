import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import * as authCtrl from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';
import { sendResetEmail, resetPassword } from '../controllers/auth.js';
import { emailSchema, resetPwdSchema } from '../schemas/authSchemas.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(authCtrl.register),
);
router.post('/login', validateBody(loginSchema), ctrlWrapper(authCtrl.login));
router.post('/refresh', ctrlWrapper(authCtrl.refresh));
router.post('/logout', ctrlWrapper(authCtrl.logout));

router.post(
  '/send-reset-email',
  validateBody(emailSchema),
  ctrlWrapper(sendResetEmail),
);
router.post(
  '/reset-pwd',
  validateBody(resetPwdSchema),
  ctrlWrapper(resetPassword),
);

export default router;
