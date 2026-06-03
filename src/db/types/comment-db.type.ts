import { WithId } from 'mongodb';
import { CommentType } from '../../comments/types/comment.type';

/*Тип для комментария в БД.*/
export type CommentDBType = WithId<CommentType>;
