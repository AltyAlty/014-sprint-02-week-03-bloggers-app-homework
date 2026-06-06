import { body } from 'express-validator';
import { usersRepository } from '../repositories/users.repository';
import { UserDBType } from '../repositories/types/user-db.type';

/*Middleware "loginValidation" проверяет, что поле "login":
1. Является строкой.
2. Состоит из не менее 3 и не более 10 символов.
3. Содержит только буквы, цифры, нижние подчеркивания и тире.
4. Является уникальным в БД.*/
const loginValidation = body('login')
  .isString()
  .withMessage('Field "login" must be a string')
  .trim()
  .isLength({ min: 3, max: 10 })
  .withMessage('Field "login" is too short or too long')
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage('Field "login" can only contain letters, numbers, underscores and hyphens')
  .custom(async (login: string) => {
    /*Просим репозиторий "usersRepository" найти пользователя по логину в БД. Если пользователь будет найден, то это
    означает, что логин не уникальный. В таком случае выкидываем ошибку с информацией об этом.*/
    const user: UserDBType | null = await usersRepository.findByLoginOrEmail(login);
    if (user) throw new Error('Field "login" must be unique');
    return true;
  });

/*Middleware "passwordValidation" проверяет, что поле "password":
1. Является строкой.
2. Состоит из не менее 6 и не более 20 символов.*/
const passwordValidation = body('password')
  .isString()
  .withMessage('Field "password" must be a string')
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage('Field "password" is too short or too long');

/*Middleware "emailValidation" проверяет, что поле "email":
1. Является строкой.
2. Соответствует формату электронной почты.
3. Является уникальной в БД.*/
const emailValidation = body('email')
  .isString()
  .withMessage('Field "email" must be a string')
  .trim()
  .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
  .withMessage('Field "email" has wrong format')
  .isEmail()
  .withMessage('Field "email" has wrong format')
  .custom(async (email: string) => {
    /*Просим репозиторий "usersRepository" найти пользователя по email в БД. Если пользователь будет найден, то это
    означает, что email не уникальный. В таком случае выкидываем ошибку с информацией об этом.*/
    const user: UserDBType | null = await usersRepository.findByLoginOrEmail(email);
    if (user) throw new Error('Field "email" must be unique');
    return true;
  });

/*Комбинируем вышеуказанные middlewares в один middleware "userCreateInputValidation", чтобы использовать его для
проверки запросов по созданию пользователя.*/
export const userCreateInputValidation = [loginValidation, passwordValidation, emailValidation];
