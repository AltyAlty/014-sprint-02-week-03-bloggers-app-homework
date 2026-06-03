import { Request, Response } from 'express';
import { blogsCollection, commentsCollection, postsCollection, usersCollection } from '../../../db/mongodb/mongo.db';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';

/*Функция-обработчик "clearDbHandler()" для DELETE-запросов по очистке БД для целей тестирования.*/
export const clearDbHandler = async (req: Request, res: Response) => {
  try {
    /*Очищаем коллекции.*/
    await Promise.all([
      blogsCollection.deleteMany(),
      postsCollection.deleteMany(),
      commentsCollection.deleteMany(),
      usersCollection.deleteMany(),
    ]);

    /*Сообщаем об очистке БД клиенту.*/
    res.sendStatus(HttpStatuses.NoContent_204);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
