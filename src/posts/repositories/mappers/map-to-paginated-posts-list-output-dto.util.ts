import { PaginatedPostsListOutputDTO } from '../../routes/output-dto/paginated-posts-list.output-dto';
import { PostOutputDTO } from '../../routes/output-dto/post.output-dto';
import { PostDBType } from '../../../db/types/post-db.type';

/*Функция "mapToPaginatedPostsListOutputDTO()" преобразовывает посты из БД в подготовленные для пагинации посты.*/
export const mapToPaginatedPostsListOutputDTO = (
  posts: PostDBType[],
  meta: { pageNumber: number; pageSize: number; totalCount: number }
): PaginatedPostsListOutputDTO => {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: posts.map(
      (post): PostOutputDTO => ({
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
      })
    ),
  };
};
