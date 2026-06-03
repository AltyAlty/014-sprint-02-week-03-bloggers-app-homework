import { WithId } from 'mongodb';
import { UserType } from '../../users/types/user.type';

/*Тип для пользователя в БД.*/
export type UserDBType = WithId<UserType>;
