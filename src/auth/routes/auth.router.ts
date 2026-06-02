import { Router } from 'express';
import { authByLoginOrEmailHandler } from './handlers/auth-by-login-or-email.handler';
import {
  authUserPostInputValidation,
  confirmationCodeValidation,
  registrationEmailResendingValidation,
} from '../validation/auth-input-validation.middlewares';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { accessTokenGuardMiddleware } from '../middlewares/guard-middlewares/access-token.guard-middleware';
import { getAuthDataByTokenHandler } from './handlers/get-auth-data-by-token.handler';
import { userCreateInputValidation } from '../../users/validation/user-input-validation.middlewares';
import { registerUserHandler } from './handlers/register-user.handler';
import { confirmUserByCodeHandler } from './handlers/confirm-user-by-code.handler';
import { resendConfirmationEmailHandler } from './handlers/repeat-user-registraion.handler';

/*Роутер из Express для работы с аутентификацией и авторизацией.*/
export const authRouter: Router = Router({});
/*Конфигурируем роутер "authRouter".*/
authRouter
  /*001. POST-запрос по аутентификации пользователя по логину/email.*/
  .post('/login', authUserPostInputValidation, inputValidationResultMiddleware, authByLoginOrEmailHandler)
  /*002. GET-запрос по получению данных пользователя по токену.*/
  .get('/me', accessTokenGuardMiddleware, getAuthDataByTokenHandler)
  /*003. POST-запрос по регистрации пользователя.*/
  .post('/registration', userCreateInputValidation, inputValidationResultMiddleware, registerUserHandler)
  /*004. POST-запрос по подтверждению регистрации пользователя по коду.*/
  .post(
    '/registration-confirmation',
    confirmationCodeValidation,
    inputValidationResultMiddleware,
    confirmUserByCodeHandler
  )
  /*005. POST-запрос по повторной отправке письма для подтверждения регистрация пользователя.*/
  .post(
    '/registration-email-resending',
    registrationEmailResendingValidation,
    inputValidationResultMiddleware,
    resendConfirmationEmailHandler
  );
