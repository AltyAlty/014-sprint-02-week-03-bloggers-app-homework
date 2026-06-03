import { WithId } from 'mongodb';
import { BlogType } from '../../blogs/types/blog.type';

/*Тип для блога в БД.*/
export type BlogDBType = WithId<BlogType>;
