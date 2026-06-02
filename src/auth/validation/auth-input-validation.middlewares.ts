import { body } from 'express-validator';
import { WithId } from 'mongodb';
import { UserType } from '../../users/types/user.type';
import { usersRepository } from '../../users/repositories/users.repository';

/*Middleware "loginOrEmail" проверяет, что поле "login" является строкой.*/
const loginOrEmailValidation = body('loginOrEmail')
  .isString()
  .withMessage('loginOrEmail must be a string')
  .trim()
  .isLength({ min: 1 })
  .withMessage('loginOrEmail is too short');

/*Middleware "passwordValidation" проверяет, что поле "password":
1. Является строкой.
2. Состоит из не менее 6 и не более 20 символов.*/
const passwordValidation = body('password')
  .isString()
  .withMessage('password must be a string')
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage('password is too short or too long');

/*Middleware "confirmationCodeValidation" проверяет, что поле "code":
1. Является строкой.
2. Соответствует формату UUID.
3. Относится к пользователю, который ожидает подтверждения почты.
4. Не относится к пользователю, у которого уже была подтверждена почта.*/
export const confirmationCodeValidation = body('code')
  .isString()
  .withMessage('code must be a string')
  .notEmpty()
  .withMessage('code is required')
  .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  .withMessage('code has wrong format')
  .trim()
  .custom(async (code: string) => {
    /*Просим репозиторий "usersRepository" найти пользователя по коду подтверждения в БД. Выкидываем ошибки с
    соответствующей информацией:
    1. Если пользователь не был найден, что означает, что код некорректный.
    2. Если регистрация пользователя уже была подтверждена.*/
    const user: WithId<UserType> | null = await usersRepository.findByConfirmationCode(code);
    if (!user) throw new Error('Invalid confirmation code');
    if (user.emailConfirmation.isConfirmed) throw new Error('Registration has already been confirmed');
    return true;
  });

/*Middleware "registrationEmailResendingValidation" проверяет, что поле "email":
1. Является строкой.
2. Соответствует формату электронной почты.
3. Не относится к пользователю, который уже был подтвержден.*/
export const registrationEmailResendingValidation = body('email')
  .isString()
  .withMessage('email must be a string')
  .trim()
  .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
  .withMessage('email has wrong format')
  .isEmail()
  .withMessage('email has wrong format')
  .custom(async (email: string) => {
    /*Просим репозиторий "usersRepository" найти пользователя по email в БД. Выкидываем ошибки с соответствующей
    информацией:
    1. Если пользователь не был найден, что означает, что email некорректный.
    2. Если регистрация пользователя уже была подтверждена.*/
    const user: WithId<UserType> | null = await usersRepository.findByEmail(email);
    if (!user) throw new Error('Invalid email');
    if (user.emailConfirmation.isConfirmed) throw new Error('Registration has already been confirmed');
    return true;
  });

/*Комбинируем вышеуказанные middlewares в один middleware "authUserPostInputValidation", чтобы использовать его для
проверки запросов по аутентификации пользователя.*/
export const authUserPostInputValidation = [loginOrEmailValidation, passwordValidation];
