import { PaginatedBlogsListOutputDTO } from '../../routes/output-dto/paginated-blogs-list.output-dto';
import { BlogOutputDTO } from '../../routes/output-dto/blog.output-dto';
import { BlogDBType } from '../../../db/types/blog-db.type';

/*Функция "mapToPaginatedBlogsListOutputDTO()" преобразовывает блоги из БД в подготовленные для пагинации блоги.*/
export const mapToPaginatedBlogsListOutputDTO = (
  blogs: BlogDBType[],
  meta: { pageNumber: number; pageSize: number; totalCount: number }
): PaginatedBlogsListOutputDTO => {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: blogs.map(
      (blog): BlogOutputDTO => ({
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
      })
    ),
  };
};
