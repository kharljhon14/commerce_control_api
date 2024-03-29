import { Router } from 'express';
import {
  activateAccount,
  getUser,
  resetPassword,
  sendActivationEmail,
  sendForgotPasswordEmail,
  signIn,
  signUp,
} from '../controllers/auth.controller';
import { isAuthenticated } from '../middlewares/auth';
import { validateSchemaBody } from '../middlewares/schema';
import {
  ActivateAccountSchema,
  ResetPasswordSchema,
  SendActivationEmailSchema,
  SendForgotPasswordSchema,
  SignInSchema,
  SignUpSchema,
} from '../schemas/user.schema';

const router = Router();

router.post('/sign-in', validateSchemaBody(SignInSchema), signIn);
router.post('/sign-up', validateSchemaBody(SignUpSchema), signUp);
router.get('/user', isAuthenticated, getUser);
router.post(
  '/send-activation/',
  validateSchemaBody(SendActivationEmailSchema),
  sendActivationEmail
);
router.post('/activate/', validateSchemaBody(ActivateAccountSchema), activateAccount);

router.post(
  '/forgot-password',
  validateSchemaBody(SendForgotPasswordSchema),
  sendForgotPasswordEmail
);

router.patch('/reset-password', validateSchemaBody(ResetPasswordSchema), resetPassword);

export default router;
