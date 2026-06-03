import { WithId } from 'mongodb';
import { PostType } from '../../posts/types/post.type';

/*Тип для поста в БД.*/
export type PostDBType = WithId<PostType>;
