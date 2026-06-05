import 'dotenv/config';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { SETTINGS } from '../../../src/core/settings/settings';
import { createBlog } from '../../utils/blogs/create-blog';
import { getBlogById } from '../../utils/blogs/get-blog-by-id';
import { BlogOutputDTO } from '../../../src/blogs/routes/output-dto/blog.output-dto';
import { getBlogsList } from '../../utils/blogs/get-blogs-list';
import { getPostsListByBlogId } from '../../utils/blogs/get-posts-list-by-blog-id';
import { PaginatedPostsListOutputDTO } from '../../../src/posts/routes/output-dto/paginated-posts-list.output-dto';
import { PaginatedBlogsListOutputDTO } from '../../../src/blogs/routes/output-dto/paginated-blogs-list.output-dto';
import { createPostInBlog } from '../../utils/blogs/create-post-in-blog';
import { updateBlogById } from '../../utils/blogs/update-blog-by-id';
import { deleteBlogById } from '../../utils/blogs/delete-blog-by-id';
import { doBeforeTests, doBeforeTestsWithMongoMemoryServer } from '../../utils/common/do-before-tests';

describe('Blogs API validation', () => {
  // const app = doBeforeTests();
  const app = doBeforeTestsWithMongoMemoryServer();

  it('❌ 001 should not create a blog without proper basic authorization; POST /api/blogs', async () => {
    await createBlog(app, undefined, HttpStatuses.Unauthorized_401, 'token');
    const getBlogsListResponse: PaginatedBlogsListOutputDTO = await getBlogsList(app);

    expect(getBlogsListResponse.items).toBeInstanceOf(Array);
    expect(getBlogsListResponse.items.length).toBe(0);
    expect(getBlogsListResponse.totalCount).toBe(0);
  });

  it('❌ 002 should not create a blog when incorrect body passed; POST /api/blogs', async () => {
    const incorrectName_01: string = '';
    const incorrectName_02: string = '   ';
    const incorrectName_03: string = '0123456789111111';
    const incorrectName_04: null = null;
    const incorrectDescription_01: string = '';
    const incorrectDescription_02: string = '   ';
    const incorrectDescription_03: null = null;
    const incorrectWebsiteUrl_01: string = '';
    const incorrectWebsiteUrl_02: string = '   ';
    const incorrectWebsiteUrl_03: string = 'www.websiteurl01.com/blog-01';
    const incorrectWebsiteUrl_04: null = null;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const createBlogResponse_01: any = await createBlog(app, { name: incorrectName_01 }, testStatus);
    const createBlogResponse_02: any = await createBlog(app, { name: incorrectName_02 }, testStatus);
    const createBlogResponse_03: any = await createBlog(app, { name: incorrectName_03 }, testStatus);
    const createBlogResponse_04: any = await createBlog(app, { name: incorrectName_04 }, testStatus);
    const createBlogResponse_05: any = await createBlog(app, { description: incorrectDescription_01 }, testStatus);
    const createBlogResponse_06: any = await createBlog(app, { description: incorrectDescription_02 }, testStatus);
    const createBlogResponse_07: any = await createBlog(app, { description: incorrectDescription_03 }, testStatus);
    const createBlogResponse_08: any = await createBlog(app, { websiteUrl: incorrectWebsiteUrl_01 }, testStatus);
    const createBlogResponse_09: any = await createBlog(app, { websiteUrl: incorrectWebsiteUrl_02 }, testStatus);
    const createBlogResponse_10: any = await createBlog(app, { websiteUrl: incorrectWebsiteUrl_03 }, testStatus);
    const createBlogResponse_11: any = await createBlog(app, { websiteUrl: incorrectWebsiteUrl_04 }, testStatus);
    const getBlogsListResponse: PaginatedBlogsListOutputDTO = await getBlogsList(app);

    expect(getBlogsListResponse.items).toBeInstanceOf(Array);
    expect(getBlogsListResponse.items.length).toBe(0);
    expect(getBlogsListResponse.totalCount).toBe(0);
    expect(createBlogResponse_01.errorsMessages[0].field).toBe('name');
    expect(createBlogResponse_01.errorsMessages[0].message).toBe('Field "name" is too short or too long');
    expect(createBlogResponse_02.errorsMessages[0].field).toBe('name');
    expect(createBlogResponse_02.errorsMessages[0].message).toBe('Field "name" is too short or too long');
    expect(createBlogResponse_03.errorsMessages[0].field).toBe('name');
    expect(createBlogResponse_03.errorsMessages[0].message).toBe('Field "name" is too short or too long');
    expect(createBlogResponse_04.errorsMessages[0].field).toBe('name');
    expect(createBlogResponse_04.errorsMessages[0].message).toBe('Field "name" must be a string');
    expect(createBlogResponse_05.errorsMessages[0].field).toBe('description');
    expect(createBlogResponse_05.errorsMessages[0].message).toBe('Field "description" is too short or too long');
    expect(createBlogResponse_06.errorsMessages[0].field).toBe('description');
    expect(createBlogResponse_06.errorsMessages[0].message).toBe('Field "description" is too short or too long');
    expect(createBlogResponse_07.errorsMessages[0].field).toBe('description');
    expect(createBlogResponse_07.errorsMessages[0].message).toBe('Field "description" must be a string');
    expect(createBlogResponse_08.errorsMessages[0].field).toBe('websiteUrl');
    expect(createBlogResponse_08.errorsMessages[0].message).toBe('Field "websiteUrl" is too short or too long');
    expect(createBlogResponse_09.errorsMessages[0].field).toBe('websiteUrl');
    expect(createBlogResponse_09.errorsMessages[0].message).toBe('Field "websiteUrl" is too short or too long');
    expect(createBlogResponse_10.errorsMessages[0].field).toBe('websiteUrl');
    expect(createBlogResponse_10.errorsMessages[0].message).toBe('Field "websiteUrl" is not correct');
    expect(createBlogResponse_11.errorsMessages[0].field).toBe('websiteUrl');
    expect(createBlogResponse_11.errorsMessages[0].message).toBe('Field "websiteUrl" must be a string');
  });

  it('❌ 003 should not return a blog by incorrect ID; GET /api/blogs/:id', async () => {
    const incorrectBlogId_01: string = 'ABC';
    const incorrectBlogId_02: number = 2;
    const incorrectBlogId_03: null = null;
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const getBlogByIdResponse_01: any = await getBlogById(app, incorrectBlogId_01, testStatus);
    const getBlogByIdResponse_02: any = await getBlogById(app, incorrectBlogId_02, testStatus);
    const getBlogByIdResponse_03: any = await getBlogById(app, incorrectBlogId_03, testStatus);
    const getBlogByIdResponse_04: BlogOutputDTO = await getBlogById(app, createdBlogId);

    expect(getBlogByIdResponse_04).toEqual(createdBlog);
    expect(getBlogByIdResponse_01.errorsMessages[0].field).toBe('id');
    expect(getBlogByIdResponse_01.errorsMessages[0].message).toBe('Field "id" has incorrect format of ObjectId');
    expect(getBlogByIdResponse_02.errorsMessages[0].field).toBe('id');
    expect(getBlogByIdResponse_03.errorsMessages[0].message).toBe('Field "id" has incorrect format of ObjectId');
    expect(getBlogByIdResponse_03.errorsMessages[0].field).toBe('id');
    expect(getBlogByIdResponse_03.errorsMessages[0].message).toBe('Field "id" has incorrect format of ObjectId');
  });

  it('❌ 004 should not return a list of blogs when incorrect pagination settings passed; GET /api/blogs', async () => {
    const correctPageSize: number = 5;
    const correctPageNumber: number = 1;
    const correctSortDirection: string = 'asc';
    const correctSortBy: string = 'name';
    const correctUrl: string = `${SETTINGS.BLOGS_PATH}?pageSize=${correctPageSize}&pageNumber=${correctPageNumber}&sortDirection=${correctSortDirection}&sortBy=${correctSortBy}`;
    const incorrectPageSize: number = 101;
    const incorrectPageNumber: number = -1;
    const incorrectSortDirection: string = 'cas';
    const incorrectSortBy: string = 'shortDescription';
    const incorrectUrl_01: string = `${SETTINGS.BLOGS_PATH}?pageSize=${incorrectPageSize}&pageNumber=${correctPageNumber}&sortDirection=${correctSortDirection}&sortBy=${correctSortBy}`;
    const incorrectUrl_02: string = `${SETTINGS.BLOGS_PATH}?pageSize=${correctPageSize}&pageNumber=${incorrectPageNumber}&sortDirection=${correctSortDirection}&sortBy=${correctSortBy}`;
    const incorrectUrl_03: string = `${SETTINGS.BLOGS_PATH}?pageSize=${correctPageSize}&pageNumber=${correctPageNumber}&sortDirection=${incorrectSortDirection}&sortBy=${correctSortBy}`;
    const incorrectUrl_04: string = `${SETTINGS.BLOGS_PATH}?pageSize=${correctPageSize}&pageNumber=${correctPageNumber}&sortDirection=${correctSortDirection}&sortBy=${incorrectSortBy}`;
    await Promise.all([createBlog(app), createBlog(app)]);
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const getBlogsListResponse_01: any = await getBlogsList(app, incorrectUrl_01, testStatus);
    const getBlogsListResponse_02: any = await getBlogsList(app, incorrectUrl_02, testStatus);
    const getBlogsListResponse_03: any = await getBlogsList(app, incorrectUrl_03, testStatus);
    const getBlogsListResponse_04: any = await getBlogsList(app, incorrectUrl_04, testStatus);
    const getBlogsListResponse_05: PaginatedBlogsListOutputDTO = await getBlogsList(app, correctUrl);

    expect(getBlogsListResponse_05.items).toBeInstanceOf(Array);
    expect(getBlogsListResponse_05.items.length).toBe(2);
    expect(getBlogsListResponse_05.totalCount).toBe(2);
    expect(getBlogsListResponse_01.errorsMessages[0].field).toBe('pageSize');
    expect(getBlogsListResponse_01.errorsMessages[0].message).toBe('Page size must be between 1 and 100');
    expect(getBlogsListResponse_02.errorsMessages[0].field).toBe('pageNumber');
    expect(getBlogsListResponse_02.errorsMessages[0].message).toBe('Page number must be a positive integer');
    expect(getBlogsListResponse_03.errorsMessages[0].field).toBe('sortDirection');
    expect(getBlogsListResponse_03.errorsMessages[0].message).toBe('Sort direction must be one of: asc, desc');
    expect(getBlogsListResponse_04.errorsMessages[0].field).toBe('sortBy');

    expect(getBlogsListResponse_04.errorsMessages[0].message).toBe(
      'Invalid sort field. Allowed values: createdAt, name, description, websiteUrl'
    );
  });

  it('❌ 005 should not update a blog by ID without proper basic authorization; PUT /api/blogs/:id', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;

    await updateBlogById(app, createdBlogId, undefined, HttpStatuses.Unauthorized_401, 'token');
    const getBlogByIdResponse: BlogOutputDTO = await getBlogById(app, createdBlogId);

    expect(getBlogByIdResponse).toEqual(createdBlog);
  });

  it('❌ 006 should not update a blog by incorrect ID; PUT /api/blogs/:id', async () => {
    const incorrectBlogId_01: string = 'ABC';
    const incorrectBlogId_02: number = 2;
    const incorrectBlogId_03: null = null;
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const updateBlogByIdResponse_01: any = await updateBlogById(app, incorrectBlogId_01, undefined, testStatus);
    const updateBlogByIdResponse_02: any = await updateBlogById(app, incorrectBlogId_02, undefined, testStatus);
    const updateBlogByIdResponse_03: any = await updateBlogById(app, incorrectBlogId_03, undefined, testStatus);
    const getBlogByIdResponse: BlogOutputDTO = await getBlogById(app, createdBlogId);

    expect(getBlogByIdResponse).toEqual(createdBlog);
    expect(updateBlogByIdResponse_01.errorsMessages[0].field).toBe('id');
    expect(updateBlogByIdResponse_01.errorsMessages[0].message).toBe('Field "id" has incorrect format of ObjectId');
    expect(updateBlogByIdResponse_02.errorsMessages[0].field).toBe('id');
    expect(updateBlogByIdResponse_02.errorsMessages[0].message).toBe('Field "id" has incorrect format of ObjectId');
    expect(updateBlogByIdResponse_03.errorsMessages[0].field).toBe('id');
    expect(updateBlogByIdResponse_03.errorsMessages[0].message).toBe('Field "id" has incorrect format of ObjectId');
  });

  it('❌ 007 should not update a blog by ID when incorrect body passed; PUT /api/blogs/:id', async () => {
    const incorrectName_01: string = '';
    const incorrectName_02: string = '   ';
    const incorrectName_03: string = '0123456789111111';
    const incorrectName_04: null = null;
    const incorrectDescription_01: string = '';
    const incorrectDescription_02: string = '   ';
    const incorrectDescription_03: null = null;
    const incorrectWebsiteUrl_01: string = '';
    const incorrectWebsiteUrl_02: string = '   ';
    const incorrectWebsiteUrl_03: string = 'www.websiteurl01.com/blog-01';
    const incorrectWebsiteUrl_04: null = null;
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const updateBlogByIdResponse_01: any = await updateBlogById(
      app,
      createdBlogId,
      { name: incorrectName_01 },
      testStatus
    );

    const updateBlogByIdResponse_02: any = await updateBlogById(
      app,
      createdBlogId,
      { name: incorrectName_02 },
      testStatus
    );

    const updateBlogByIdResponse_03: any = await updateBlogById(
      app,
      createdBlogId,
      { name: incorrectName_03 },
      testStatus
    );

    const updateBlogByIdResponse_04: any = await updateBlogById(
      app,
      createdBlogId,
      { name: incorrectName_04 },
      testStatus
    );

    const updateBlogByIdResponse_05: any = await updateBlogById(
      app,
      createdBlogId,
      { description: incorrectDescription_01 },
      testStatus
    );

    const updateBlogByIdResponse_06: any = await updateBlogById(
      app,
      createdBlogId,
      { description: incorrectDescription_02 },
      testStatus
    );

    const updateBlogByIdResponse_07: any = await updateBlogById(
      app,
      createdBlogId,
      { description: incorrectDescription_03 },
      testStatus
    );

    const updateBlogByIdResponse_08: any = await updateBlogById(
      app,
      createdBlogId,
      { websiteUrl: incorrectWebsiteUrl_01 },
      testStatus
    );

    const updateBlogByIdResponse_09: any = await updateBlogById(
      app,
      createdBlogId,
      { websiteUrl: incorrectWebsiteUrl_02 },
      testStatus
    );

    const updateBlogByIdResponse_10: any = await updateBlogById(
      app,
      createdBlogId,
      { websiteUrl: incorrectWebsiteUrl_03 },
      testStatus
    );

    const updateBlogByIdResponse_11: any = await updateBlogById(
      app,
      createdBlogId,
      { websiteUrl: incorrectWebsiteUrl_04 },
      testStatus
    );

    const getBlogByIdResponse: BlogOutputDTO = await getBlogById(app, createdBlogId);

    expect(getBlogByIdResponse).toEqual(createdBlog);
    expect(updateBlogByIdResponse_01.errorsMessages[0].field).toBe('name');
    expect(updateBlogByIdResponse_01.errorsMessages[0].message).toBe('Field "name" is too short or too long');
    expect(updateBlogByIdResponse_02.errorsMessages[0].field).toBe('name');
    expect(updateBlogByIdResponse_02.errorsMessages[0].message).toBe('Field "name" is too short or too long');
    expect(updateBlogByIdResponse_03.errorsMessages[0].field).toBe('name');
    expect(updateBlogByIdResponse_03.errorsMessages[0].message).toBe('Field "name" is too short or too long');
    expect(updateBlogByIdResponse_04.errorsMessages[0].field).toBe('name');
    expect(updateBlogByIdResponse_04.errorsMessages[0].message).toBe('Field "name" must be a string');
    expect(updateBlogByIdResponse_05.errorsMessages[0].field).toBe('description');
    expect(updateBlogByIdResponse_05.errorsMessages[0].message).toBe('Field "description" is too short or too long');
    expect(updateBlogByIdResponse_06.errorsMessages[0].field).toBe('description');
    expect(updateBlogByIdResponse_06.errorsMessages[0].message).toBe('Field "description" is too short or too long');
    expect(updateBlogByIdResponse_07.errorsMessages[0].field).toBe('description');
    expect(updateBlogByIdResponse_07.errorsMessages[0].message).toBe('Field "description" must be a string');
    expect(updateBlogByIdResponse_08.errorsMessages[0].field).toBe('websiteUrl');
    expect(updateBlogByIdResponse_08.errorsMessages[0].message).toBe('Field "websiteUrl" is too short or too long');
    expect(updateBlogByIdResponse_09.errorsMessages[0].field).toBe('websiteUrl');
    expect(updateBlogByIdResponse_09.errorsMessages[0].message).toBe('Field "websiteUrl" is too short or too long');
    expect(updateBlogByIdResponse_10.errorsMessages[0].field).toBe('websiteUrl');
    expect(updateBlogByIdResponse_10.errorsMessages[0].message).toBe('Field "websiteUrl" is not correct');
    expect(updateBlogByIdResponse_11.errorsMessages[0].field).toBe('websiteUrl');
    expect(updateBlogByIdResponse_11.errorsMessages[0].message).toBe('Field "websiteUrl" must be a string');
  });

  it('❌ 008 should not delete a blog by ID without proper basic authorization; DELETE /api/blogs/:id', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;

    await deleteBlogById(app, createdBlogId, HttpStatuses.Unauthorized_401, 'token');
    const getBlogByIdResponse: BlogOutputDTO = await getBlogById(app, createdBlogId);

    expect(getBlogByIdResponse).toEqual(createdBlog);
  });

  it('❌ 009 should not delete a blog by incorrect ID; DELETE /api/blogs/:id', async () => {
    const incorrectBlogId_01: string = 'ABC';
    const incorrectBlogId_02: number = 2;
    const incorrectBlogId_03: null = null;
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const deleteBlogByIdResponse_01: any = await deleteBlogById(app, incorrectBlogId_01, testStatus);
    const deleteBlogByIdResponse_02: any = await deleteBlogById(app, incorrectBlogId_02, testStatus);
    const deleteBlogByIdResponse_03: any = await deleteBlogById(app, incorrectBlogId_03, testStatus);
    const getBlogByIdResponse: BlogOutputDTO = await getBlogById(app, createdBlogId);

    expect(getBlogByIdResponse).toEqual(createdBlog);
    expect(deleteBlogByIdResponse_01.errorsMessages[0].field).toBe('id');
    expect(deleteBlogByIdResponse_01.errorsMessages[0].message).toBe('Field "id" has incorrect format of ObjectId');
    expect(deleteBlogByIdResponse_02.errorsMessages[0].field).toBe('id');
    expect(deleteBlogByIdResponse_02.errorsMessages[0].message).toBe('Field "id" has incorrect format of ObjectId');
    expect(deleteBlogByIdResponse_03.errorsMessages[0].field).toBe('id');
    expect(deleteBlogByIdResponse_03.errorsMessages[0].message).toBe('Field "id" has incorrect format of ObjectId');
  });

  it('❌ 010 should not create a post for a blog by ID without proper basic authorization; POST /api/blogs/:blogId/posts', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;

    await createPostInBlog(app, createdBlogId, undefined, HttpStatuses.Unauthorized_401, 'token');
    const getPostsListByBlogIdResponse: PaginatedPostsListOutputDTO = await getPostsListByBlogId(app, createdBlogId);

    expect(getPostsListByBlogIdResponse.items).toBeInstanceOf(Array);
    expect(getPostsListByBlogIdResponse.items.length).toBe(0);
    expect(getPostsListByBlogIdResponse.totalCount).toBe(0);
  });

  it('❌ 011 should not create a post for a blog by incorrect ID; POST /api/blogs/:blogId/posts', async () => {
    const incorrectBlogId_01: string = '   ';
    const incorrectBlogId_02: string = 'ABC';
    const incorrectBlogId_03: number = 2;
    const incorrectBlogId_04: null = null;
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const createPostInBlogResponse_01: any = await createPostInBlog(app, incorrectBlogId_01, undefined, testStatus);
    const createPostInBlogResponse_02: any = await createPostInBlog(app, incorrectBlogId_02, undefined, testStatus);
    const createPostInBlogResponse_03: any = await createPostInBlog(app, incorrectBlogId_03, undefined, testStatus);
    const createPostInBlogResponse_04: any = await createPostInBlog(app, incorrectBlogId_04, undefined, testStatus);
    const getPostsListByBlogIdResponse: PaginatedPostsListOutputDTO = await getPostsListByBlogId(app, createdBlogId);

    expect(getPostsListByBlogIdResponse.items).toBeInstanceOf(Array);
    expect(getPostsListByBlogIdResponse.items.length).toBe(0);
    expect(getPostsListByBlogIdResponse.totalCount).toBe(0);
    expect(createPostInBlogResponse_01.errorsMessages[0].field).toBe('blogId');

    expect(createPostInBlogResponse_01.errorsMessages[0].message).toBe(
      'Field "blogId" has incorrect format of ObjectId'
    );

    expect(createPostInBlogResponse_02.errorsMessages[0].field).toBe('blogId');

    expect(createPostInBlogResponse_02.errorsMessages[0].message).toBe(
      'Field "blogId" has incorrect format of ObjectId'
    );

    expect(createPostInBlogResponse_03.errorsMessages[0].field).toBe('blogId');

    expect(createPostInBlogResponse_03.errorsMessages[0].message).toBe(
      'Field "blogId" has incorrect format of ObjectId'
    );

    expect(createPostInBlogResponse_04.errorsMessages[0].field).toBe('blogId');

    expect(createPostInBlogResponse_04.errorsMessages[0].message).toBe(
      'Field "blogId" has incorrect format of ObjectId'
    );
  });

  it('❌ 012 should not create a post for a blog by ID when incorrect body passed; POST /api/blogs/:blogId/posts', async () => {
    const incorrectTitle_01: string = '';
    const incorrectTitle_02: string = '   ';
    const incorrectTitle_03: string = '0123456789012345678901234567890';
    const incorrectTitle_04: string = '012345678901234567890123456789000000';
    const incorrectTitle_05: null = null;
    const incorrectShortDescription_01: string = '';
    const incorrectShortDescription_02: string = '   ';
    const incorrectShortDescription_03: null = null;
    const incorrectContent_01: string = '';
    const incorrectContent_02: string = '   ';
    const incorrectContent_03: null = null;
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const createPostInBlogResponse_01: any = await createPostInBlog(
      app,
      createdBlogId,
      { title: incorrectTitle_01 },
      testStatus
    );

    const createPostInBlogResponse_02: any = await createPostInBlog(
      app,
      createdBlogId,
      { title: incorrectTitle_02 },
      testStatus
    );

    const createPostInBlogResponse_03: any = await createPostInBlog(
      app,
      createdBlogId,
      { title: incorrectTitle_03 },
      testStatus
    );

    const createPostInBlogResponse_04: any = await createPostInBlog(
      app,
      createdBlogId,
      { title: incorrectTitle_04 },
      testStatus
    );

    const createPostInBlogResponse_05: any = await createPostInBlog(
      app,
      createdBlogId,
      { title: incorrectTitle_05 },
      testStatus
    );

    const createPostInBlogResponse_06: any = await createPostInBlog(
      app,
      createdBlogId,
      { shortDescription: incorrectShortDescription_01 },
      testStatus
    );

    const createPostInBlogResponse_07: any = await createPostInBlog(
      app,
      createdBlogId,
      { shortDescription: incorrectShortDescription_02 },
      testStatus
    );

    const createPostInBlogResponse_08: any = await createPostInBlog(
      app,
      createdBlogId,
      { shortDescription: incorrectShortDescription_03 },
      testStatus
    );

    const createPostInBlogResponse_09: any = await createPostInBlog(
      app,
      createdBlogId,
      { content: incorrectContent_01 },
      testStatus
    );

    const createPostInBlogResponse_10: any = await createPostInBlog(
      app,
      createdBlogId,
      { content: incorrectContent_02 },
      testStatus
    );

    const createPostInBlogResponse_11: any = await createPostInBlog(
      app,
      createdBlogId,
      { content: incorrectContent_03 },
      testStatus
    );

    const getPostsListByBlogIdResponse: PaginatedPostsListOutputDTO = await getPostsListByBlogId(app, createdBlogId);

    expect(getPostsListByBlogIdResponse.items).toBeInstanceOf(Array);
    expect(getPostsListByBlogIdResponse.items.length).toBe(0);
    expect(getPostsListByBlogIdResponse.totalCount).toBe(0);
    expect(createPostInBlogResponse_01.errorsMessages[0].field).toBe('title');
    expect(createPostInBlogResponse_01.errorsMessages[0].message).toBe('Field "title" is too short or too long');
    expect(createPostInBlogResponse_02.errorsMessages[0].field).toBe('title');
    expect(createPostInBlogResponse_03.errorsMessages[0].message).toBe('Field "title" is too short or too long');
    expect(createPostInBlogResponse_03.errorsMessages[0].field).toBe('title');
    expect(createPostInBlogResponse_03.errorsMessages[0].message).toBe('Field "title" is too short or too long');
    expect(createPostInBlogResponse_04.errorsMessages[0].field).toBe('title');
    expect(createPostInBlogResponse_04.errorsMessages[0].message).toBe('Field "title" is too short or too long');
    expect(createPostInBlogResponse_05.errorsMessages[0].field).toBe('title');
    expect(createPostInBlogResponse_05.errorsMessages[0].message).toBe('Field "title" must be a string');
    expect(createPostInBlogResponse_06.errorsMessages[0].field).toBe('shortDescription');

    expect(createPostInBlogResponse_06.errorsMessages[0].message).toBe(
      'Field "shortDescription" is too short or too long'
    );

    expect(createPostInBlogResponse_07.errorsMessages[0].field).toBe('shortDescription');

    expect(createPostInBlogResponse_07.errorsMessages[0].message).toBe(
      'Field "shortDescription" is too short or too long'
    );

    expect(createPostInBlogResponse_08.errorsMessages[0].field).toBe('shortDescription');
    expect(createPostInBlogResponse_08.errorsMessages[0].message).toBe('Field "shortDescription" must be a string');
    expect(createPostInBlogResponse_09.errorsMessages[0].field).toBe('content');
    expect(createPostInBlogResponse_09.errorsMessages[0].message).toBe('Field "content" is too short or too long');
    expect(createPostInBlogResponse_10.errorsMessages[0].field).toBe('content');
    expect(createPostInBlogResponse_10.errorsMessages[0].message).toBe('Field "content" is too short or too long');
    expect(createPostInBlogResponse_11.errorsMessages[0].field).toBe('content');
    expect(createPostInBlogResponse_11.errorsMessages[0].message).toBe('Field "content" must be a string');
  });

  it('❌ 013 should not return a list of posts for a blog by incorrect ID; GET /api/blogs/:blogId/posts', async () => {
    const incorrectBlogId_01: string = '   ';
    const incorrectBlogId_02: string = 'ABC';
    const incorrectBlogId_03: number = 2;
    const incorrectBlogId_04: null = null;
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    await Promise.all([createPostInBlog(app, createdBlogId), createPostInBlog(app, createdBlogId)]);
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const getPostsListByBlogIdResponse_01: any = await getPostsListByBlogId(
      app,
      incorrectBlogId_01,
      undefined,
      testStatus
    );

    const getPostsListByBlogIdResponse_02: any = await getPostsListByBlogId(
      app,
      incorrectBlogId_02,
      undefined,
      testStatus
    );

    const getPostsListByBlogIdResponse_03: any = await getPostsListByBlogId(
      app,
      incorrectBlogId_03,
      undefined,
      testStatus
    );

    const getPostsListByBlogIdResponse_04: any = await getPostsListByBlogId(
      app,
      incorrectBlogId_04,
      undefined,
      testStatus
    );

    const getPostsListByBlogIdResponse_05: PaginatedPostsListOutputDTO = await getPostsListByBlogId(app, createdBlogId);

    expect(getPostsListByBlogIdResponse_05.items).toBeInstanceOf(Array);
    expect(getPostsListByBlogIdResponse_05.items.length).toBe(2);
    expect(getPostsListByBlogIdResponse_05.totalCount).toBe(2);
    expect(getPostsListByBlogIdResponse_01.errorsMessages[0].field).toBe('blogId');

    expect(getPostsListByBlogIdResponse_01.errorsMessages[0].message).toBe(
      'Field "blogId" has incorrect format of ObjectId'
    );

    expect(getPostsListByBlogIdResponse_02.errorsMessages[0].field).toBe('blogId');

    expect(getPostsListByBlogIdResponse_02.errorsMessages[0].message).toBe(
      'Field "blogId" has incorrect format of ObjectId'
    );

    expect(getPostsListByBlogIdResponse_03.errorsMessages[0].field).toBe('blogId');

    expect(getPostsListByBlogIdResponse_03.errorsMessages[0].message).toBe(
      'Field "blogId" has incorrect format of ObjectId'
    );

    expect(getPostsListByBlogIdResponse_04.errorsMessages[0].field).toBe('blogId');

    expect(getPostsListByBlogIdResponse_04.errorsMessages[0].message).toBe(
      'Field "blogId" has incorrect format of ObjectId'
    );
  });

  it('❌ 014 should not return a list of posts for a blog by ID when incorrect pagination settings passed; GET /api/blogs/:blogId/posts', async () => {
    const correctPageSize: number = 5;
    const correctPageNumber: number = 1;
    const correctSortDirection: string = 'asc';
    const correctSortBy: string = 'title';
    const incorrectPageSize: number = 101;
    const incorrectPageNumber: number = -1;
    const incorrectSortDirection: string = 'cas';
    const incorrectSortBy: string = 'description';
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const correctUrl = `${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts?pageSize=${correctPageSize}&pageNumber=${correctPageNumber}&sortDirection=${correctSortDirection}&sortBy=${correctSortBy}`;
    const incorrectUrl_01 = `${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts?pageSize=${incorrectPageSize}&pageNumber=${correctPageNumber}&sortDirection=${correctSortDirection}&sortBy=${correctSortBy}`;
    const incorrectUrl_02 = `${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts?pageSize=${correctPageSize}&pageNumber=${incorrectPageNumber}&sortDirection=${correctSortDirection}&sortBy=${correctSortBy}`;
    const incorrectUrl_03 = `${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts?pageSize=${correctPageSize}&pageNumber=${correctPageNumber}&sortDirection=${incorrectSortDirection}&sortBy=${correctSortBy}`;
    const incorrectUrl_04 = `${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts?pageSize=${correctPageSize}&pageNumber=${correctPageNumber}&sortDirection=${correctSortDirection}&sortBy=${incorrectSortBy}`;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    await Promise.all([
      createPostInBlog(app, createdBlogId),
      createPostInBlog(app, createdBlogId),
      createPostInBlog(app, createdBlogId),
      createPostInBlog(app, createdBlogId),
      createPostInBlog(app, createdBlogId),
      createPostInBlog(app, createdBlogId),
    ]);

    const getPostsListByBlogIdResponse_01: any = await getPostsListByBlogId(
      app,
      createdBlogId,
      incorrectUrl_01,
      testStatus
    );

    const getPostsListByBlogIdResponse_02: any = await getPostsListByBlogId(
      app,
      createdBlogId,
      incorrectUrl_02,
      testStatus
    );

    const getPostsListByBlogIdResponse_03: any = await getPostsListByBlogId(
      app,
      createdBlogId,
      incorrectUrl_03,
      testStatus
    );

    const getPostsListByBlogIdResponse_04: any = await getPostsListByBlogId(
      app,
      createdBlogId,
      incorrectUrl_04,
      testStatus
    );

    const getPostsListByBlogIdResponse_05: PaginatedPostsListOutputDTO = await getPostsListByBlogId(
      app,
      createdBlogId,
      correctUrl
    );

    expect(getPostsListByBlogIdResponse_05.items).toBeInstanceOf(Array);
    expect(getPostsListByBlogIdResponse_05.items.length).toBe(5);
    expect(getPostsListByBlogIdResponse_05.totalCount).toBe(6);
    expect(getPostsListByBlogIdResponse_01.errorsMessages[0].field).toBe('pageSize');
    expect(getPostsListByBlogIdResponse_01.errorsMessages[0].message).toBe('Page size must be between 1 and 100');
    expect(getPostsListByBlogIdResponse_02.errorsMessages[0].field).toBe('pageNumber');
    expect(getPostsListByBlogIdResponse_02.errorsMessages[0].message).toBe('Page number must be a positive integer');
    expect(getPostsListByBlogIdResponse_03.errorsMessages[0].field).toBe('sortDirection');
    expect(getPostsListByBlogIdResponse_03.errorsMessages[0].message).toBe('Sort direction must be one of: asc, desc');
    expect(getPostsListByBlogIdResponse_04.errorsMessages[0].field).toBe('sortBy');

    expect(getPostsListByBlogIdResponse_04.errorsMessages[0].message).toBe(
      'Invalid sort field. Allowed values: createdAt, title, shortDescription, content, blogId, blogName'
    );
  });
});
