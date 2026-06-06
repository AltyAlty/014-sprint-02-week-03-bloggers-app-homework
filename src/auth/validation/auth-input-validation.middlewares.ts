import { body } from 'express-validator';
import { usersRepository } from '../../users/repositories/users.repository';
import { UserDBType } from '../../users/repositories/types/user-db.type';

/*Middleware "loginOrEmail" проверяет, что поле "login" является строкой.*/
const loginOrEmailValidation = body('loginOrEmail')
  .isString()
  .withMessage('field "loginOrEmail" must be a string')
  .trim()
  .isLength({ min: 1 })
  .withMessage('field "loginOrEmail" is too short');

/*Middleware "passwordValidation" проверяет, что поле "password":
1. Является строкой.
2. Состоит из не менее 6 и не более 20 символов.*/
const passwordValidation = body('password')
  .isString()
  .withMessage('Field "password" must be a string')
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage('Field "password" is too short or too long');

/*Middleware "confirmationCodeValidation" проверяет, что поле "code":
1. Является строкой.
2. Соответствует формату UUID.
3. Относится к пользователю, который ожидает подтверждения почты.
4. Не относится к пользователю, у которого уже была подтверждена почта.*/
export const confirmationCodeValidation = body('code')
  .isString()
  .withMessage('Field "code" must be a string')
  .notEmpty()
  .withMessage('Field "code" is required')
  .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
  .withMessage('Field "code" has wrong format')
  .trim()
  .custom(async (code: string) => {
    /*Просим репозиторий "usersRepository" найти пользователя по коду подтверждения в БД. Выкидываем ошибки с
    соответствующей информацией:
    1. Если пользователь не был найден, что означает, что код подтверждения некорректный.
    2. Если регистрация пользователя уже была подтверждена.
    3. Если срок действия кода подтверждения истек.*/
    const user: UserDBType | null = await usersRepository.findByConfirmationCode(code);
    if (!user) throw new Error('Field "code" is invalid');
    if (user.emailConfirmation.isConfirmed) throw new Error('Registration has already been confirmed');
    if (user.emailConfirmation.expirationDate <= new Date()) throw new Error('Confirmation code has expired');
    return true;
  });

/*Middleware "registrationEmailResendingValidation" проверяет, что поле "email":
1. Является строкой.
2. Соответствует формату электронной почты.
3. Не относится к пользователю, который уже был подтвержден.*/
export const registrationEmailResendingValidation = body('email')
  .isString()
  .withMessage('Field "email" must be a string')
  .trim()
  .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
  .withMessage('Field "email" has wrong format')
  .isEmail()
  .withMessage('Field "email" has wrong format')
  .custom(async (email: string) => {
    /*Просим репозиторий "usersRepository" найти пользователя по email в БД. Выкидываем ошибки с соответствующей
    информацией:
    1. Если пользователь не был найден, что означает, что email некорректный.
    2. Если регистрация пользователя уже была подтверждена.*/
    const user: UserDBType | null = await usersRepository.findByEmail(email);
    if (!user) throw new Error('Field "email" is invalid');
    if (user.emailConfirmation.isConfirmed) throw new Error('Registration has already been confirmed');
    return true;
  });

/*Комбинируем вышеуказанные middlewares в один middleware "authUserPostInputValidation", чтобы использовать его для
проверки запросов по аутентификации пользователя.*/
export const authUserPostInputValidation = [loginOrEmailValidation, passwordValidation];
