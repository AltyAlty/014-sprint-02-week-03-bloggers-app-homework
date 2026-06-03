/*Импортируем метод "body()" из библиотеки express-validator, чтобы проверять тело запроса.*/
import { body } from 'express-validator';

/*Middleware "nameValidation" проверяет, что поле "name":
1. Является строкой.
2. Состоит из не менее 1 и не более 15 символов.*/
const nameValidation = body('name')
  .isString()
  .withMessage('Field "name" must be a string')
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage('Field "name" is too short or too long');

/*Middleware "descriptionValidation" проверяет, что поле "description":
1. Является строкой.
2. Состоит из не менее 1 и не более 500 символов.*/
const descriptionValidation = body('description')
  .isString()
  .withMessage('Field "description" must be a string')
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage('Field "description" is too short or too long');

/*Middleware "websiteUrlValidation" проверяет, что поле "websiteUrl":
1. Является строкой.
2. Состоит из не менее 5 и не более 100 символов.
3. Соответствует регулярному выражению ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$.*/
const websiteUrlValidation = body('websiteUrl')
  .isString()
  .withMessage('Field "websiteUrl" must be a string')
  .trim()
  .isLength({ min: 5, max: 100 })
  .withMessage('Field "websiteUrl" is too short or too long')
  .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
  .withMessage('Field "websiteUrl" is not correct');

/*Комбинируем вышеуказанные middlewares в один middleware "blogCreateInputValidation", чтобы использовать его для
проверки запросов по созданию блога.*/
export const blogCreateInputValidation = [nameValidation, descriptionValidation, websiteUrlValidation];
/*Комбинируем вышеуказанные middlewares в один middleware "blogUpdateInputValidation", чтобы использовать его для
проверки запросов по изменению блога.*/
export const blogUpdateInputValidation = [nameValidation, descriptionValidation, websiteUrlValidation];
