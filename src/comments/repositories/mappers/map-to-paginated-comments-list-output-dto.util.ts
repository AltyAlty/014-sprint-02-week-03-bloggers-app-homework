import { PaginatedCommentsListOutputDTO } from '../../routes/output-dto/paginated-comments-list.output-dto';
import { CommentOutputDTO } from '../../routes/output-dto/comment.output-dto';
import { CommentDBType } from '../../../db/types/comment-db.type';

/*Функция "mapToPaginatedCommentsListOutputDTO()" преобразовывает комментарии из БД в подготовленные для пагинации
комментарии.*/
export const mapToPaginatedCommentsListOutputDTO = (
  comments: CommentDBType[],
  meta: { pageNumber: number; pageSize: number; totalCount: number }
): PaginatedCommentsListOutputDTO => {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: comments.map(
      (comment): CommentOutputDTO => ({
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt,
      })
    ),
  };
};
