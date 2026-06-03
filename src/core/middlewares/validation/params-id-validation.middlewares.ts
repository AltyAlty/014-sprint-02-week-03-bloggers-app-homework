/*Импортируем метод "param()" из библиотеки express-validator, чтобы проверять ID.*/
import { param } from 'express-validator';

/*Middleware "idValidation" проверяет, что поле "id":
1. Существует в запросе.
2. Является строкой.
3. Не является пустым.
4. Является типа ObjectId.*/
export const idValidation = param('id')
  .exists()
  .withMessage('Field "id" is required')
  .isString()
  .withMessage('Field "id" must be a string')
  .isLength({ min: 1 })
  .withMessage('Field "id" must not be empty')
  .isMongoId()
  .withMessage('Field "id" has incorrect format of ObjectId');

/*Middleware "blogIdValidation" проверяет, что поле "blogId":
1. Существует в запросе.
2. Является строкой.
3. Не является пустым.
4. Является типа ObjectId.*/
export const blogIdValidation = param('blogId')
  .exists()
  .withMessage('Field "blogId" is required')
  .isString()
  .withMessage('Field "blogId" must be a string')
  .isLength({ min: 1 })
  .withMessage('Field "blogId" must not be empty')
  .isMongoId()
  .withMessage('Field "blogId" has incorrect format of ObjectId');

/*Middleware "postIdValidation" проверяет, что поле "postId":
1. Существует в запросе.
2. Является строкой.
3. Не является пустым.
4. Является типа ObjectId.*/
export const postIdValidation = param('postId')
  .exists()
  .withMessage('Field "postId" is required')
  .isString()
  .withMessage('Field "postId" must be a string')
  .isLength({ min: 1 })
  .withMessage('Field "postId" must not be empty')
  .isMongoId()
  .withMessage('Field "postId" has incorrect format of ObjectId');
