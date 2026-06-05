import 'dotenv/config';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { SETTINGS } from '../../../src/core/settings/settings';
import { createBlog } from '../../utils/blogs/create-blog';
import { createPost } from '../../utils/posts/create-post';
import { BlogOutputDTO } from '../../../src/blogs/routes/output-dto/blog.output-dto';
import { PostOutputDTO } from '../../../src/posts/routes/output-dto/post.output-dto';
import { getPostById } from '../../utils/posts/get-post-by-id';
import { createUser } from '../../utils/users/create-user';
import { loginUser } from '../../utils/auth/login-user';
import { CreateCommentInPostInputDTO } from '../../../src/comments/routes/input-dto/create-comment-in-post.input-dto';
import { createCommentInPost } from '../../utils/posts/create-comment-in-post';
import { doBeforeTests, doBeforeTestsWithMongoMemoryServer } from '../../utils/common/do-before-tests';
import { getPostsList } from '../../utils/posts/get-posts-list';
import { PaginatedPostsListOutputDTO } from '../../../src/posts/routes/output-dto/paginated-posts-list.output-dto';
import { updatePostById } from '../../utils/posts/update-post-by-id';
import { deletePostById } from '../../utils/posts/delete-post-by-id';
import { getCommentsListByPostId } from '../../utils/posts/get-comments-list-by-post-id';
import { CreateUserInputDTO } from '../../../src/users/routes/input-dto/create-user.input-dto';
import { getCreateUserInputDTO } from '../../utils/users/get-create-user-input-dto';
import { PaginatedCommentsListOutputDTO } from '../../../src/comments/routes/output-dto/paginated-comments-list.output-dto';

describe('Posts API validation', () => {
  // const app = doBeforeTests();
  const app = doBeforeTestsWithMongoMemoryServer();

  it('❌ 001 should not create a post without proper basic authorization; POST /api/posts', async () => {
    await createPost(app, undefined, undefined, HttpStatuses.Unauthorized_401, 'token');
    const getPostsListResponse: PaginatedPostsListOutputDTO = await getPostsList(app);

    expect(getPostsListResponse.items).toBeInstanceOf(Array);
    expect(getPostsListResponse.items.length).toBe(0);
    expect(getPostsListResponse.totalCount).toBe(0);
  });

  it('❌ 002 should not create a post when incorrect body passed; POST /api/posts', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
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
    const incorrectBlogId_01: number = 2;
    const incorrectBlogId_02: null = null;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const createPostResponse_01: any = await createPost(app, { title: incorrectTitle_01 }, createdBlogId, testStatus);
    const createPostResponse_02: any = await createPost(app, { title: incorrectTitle_02 }, createdBlogId, testStatus);
    const createPostResponse_03: any = await createPost(app, { title: incorrectTitle_03 }, createdBlogId, testStatus);
    const createPostResponse_04: any = await createPost(app, { title: incorrectTitle_04 }, createdBlogId, testStatus);
    const createPostResponse_05: any = await createPost(app, { title: incorrectTitle_05 }, createdBlogId, testStatus);

    const createPostResponse_06: any = await createPost(
      app,
      { shortDescription: incorrectShortDescription_01 },
      createdBlogId,
      testStatus
    );

    const createPostResponse_07: any = await createPost(
      app,
      { shortDescription: incorrectShortDescription_02 },
      createdBlogId,
      testStatus
    );

    const createPostResponse_08: any = await createPost(
      app,
      { shortDescription: incorrectShortDescription_03 },
      createdBlogId,
      testStatus
    );

    const createPostResponse_09: any = await createPost(
      app,
      { content: incorrectContent_01 },
      createdBlogId,
      testStatus
    );

    const createPostResponse_10: any = await createPost(
      app,
      { content: incorrectContent_02 },
      createdBlogId,
      testStatus
    );

    const createPostResponse_11: any = await createPost(
      app,
      { content: incorrectContent_03 },
      createdBlogId,
      testStatus
    );

    const createPostResponse_12: any = await createPost(app, { blogId: incorrectBlogId_01 }, createdBlogId, testStatus);
    const createPostResponse_13: any = await createPost(app, { blogId: incorrectBlogId_02 }, createdBlogId, testStatus);
    const getPostsListResponse: PaginatedPostsListOutputDTO = await getPostsList(app);

    expect(getPostsListResponse.items).toBeInstanceOf(Array);
    expect(getPostsListResponse.items.length).toBe(0);
    expect(getPostsListResponse.totalCount).toBe(0);
    expect(createPostResponse_01.errorsMessages[0].field).toBe('title');
    expect(createPostResponse_01.errorsMessages[0].message).toBe('Field "title" is too short or too long');
    expect(createPostResponse_02.errorsMessages[0].field).toBe('title');
    expect(createPostResponse_03.errorsMessages[0].message).toBe('Field "title" is too short or too long');
    expect(createPostResponse_03.errorsMessages[0].field).toBe('title');
    expect(createPostResponse_03.errorsMessages[0].message).toBe('Field "title" is too short or too long');
    expect(createPostResponse_04.errorsMessages[0].field).toBe('title');
    expect(createPostResponse_04.errorsMessages[0].message).toBe('Field "title" is too short or too long');
    expect(createPostResponse_05.errorsMessages[0].field).toBe('title');
    expect(createPostResponse_05.errorsMessages[0].message).toBe('Field "title" must be a string');
    expect(createPostResponse_06.errorsMessages[0].field).toBe('shortDescription');
    expect(createPostResponse_06.errorsMessages[0].message).toBe('Field "shortDescription" is too short or too long');
    expect(createPostResponse_07.errorsMessages[0].field).toBe('shortDescription');
    expect(createPostResponse_07.errorsMessages[0].message).toBe('Field "shortDescription" is too short or too long');
    expect(createPostResponse_08.errorsMessages[0].field).toBe('shortDescription');
    expect(createPostResponse_08.errorsMessages[0].message).toBe('Field "shortDescription" must be a string');
    expect(createPostResponse_09.errorsMessages[0].field).toBe('content');
    expect(createPostResponse_09.errorsMessages[0].message).toBe('Field "content" is too short or too long');
    expect(createPostResponse_10.errorsMessages[0].field).toBe('content');
    expect(createPostResponse_10.errorsMessages[0].message).toBe('Field "content" is too short or too long');
    expect(createPostResponse_11.errorsMessages[0].field).toBe('content');
    expect(createPostResponse_11.errorsMessages[0].message).toBe('Field "content" must be a string');
    expect(createPostResponse_12.errorsMessages[0].field).toBe('blogId');
    expect(createPostResponse_12.errorsMessages[0].message).toBe('Field "blogId" must be a string');
    expect(createPostResponse_13.errorsMessages[0].field).toBe('blogId');
    expect(createPostResponse_13.errorsMessages[0].message).toBe('Field "blogId" must be a string');
  });

  it('❌ 003 should not return a post by incorrect ID; GET /api/posts/:id', async () => {
    const incorrectPostId_01: string = 'ABC';
    const incorrectPostId_02: number = 2;
    const incorrectPostId_03: null = null;
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const getPostByIdResponse_01: any = await getPostById(app, incorrectPostId_01, testStatus);
    const getPostByIdResponse_02: any = await getPostById(app, incorrectPostId_02, testStatus);
    const getPostByIdResponse_03: any = await getPostById(app, incorrectPostId_03, testStatus);
    const getPostByIdResponse_04: PostOutputDTO = await getPostById(app, createdPostId);

    expect(getPostByIdResponse_04).toEqual(createdPost);
    expect(getPostByIdResponse_01.errorsMessages[0].field).toBe('id');
    expect(getPostByIdResponse_01.errorsMessages[0].message).toBe('Field "id" has incorrect format of ObjectId');
    expect(getPostByIdResponse_02.errorsMessages[0].field).toBe('id');
    expect(getPostByIdResponse_03.errorsMessages[0].message).toBe('Field "id" has incorrect format of ObjectId');
    expect(getPostByIdResponse_03.errorsMessages[0].field).toBe('id');
    expect(getPostByIdResponse_03.errorsMessages[0].message).toBe('Field "id" has incorrect format of ObjectId');
  });

  it('❌ 004 should not return a list of posts when incorrect pagination settings passed; GET /api/posts', async () => {
    const correctPageSize: number = 5;
    const correctPageNumber: number = 1;
    const correctSortDirection: string = 'asc';
    const correctSortBy: string = 'title';
    const correctUrl: string = `${SETTINGS.POSTS_PATH}?pageSize=${correctPageSize}&pageNumber=${correctPageNumber}&sortDirection=${correctSortDirection}&sortBy=${correctSortBy}`;
    const incorrectPageSize: number = 101;
    const incorrectPageNumber: number = -1;
    const incorrectSortDirection: string = 'cas';
    const incorrectSortBy: string = 'description';
    const incorrectUrl_01: string = `${SETTINGS.POSTS_PATH}?pageSize=${incorrectPageSize}&pageNumber=${correctPageNumber}&sortDirection=${correctSortDirection}&sortBy=${correctSortBy}`;
    const incorrectUrl_02: string = `${SETTINGS.POSTS_PATH}?pageSize=${correctPageSize}&pageNumber=${incorrectPageNumber}&sortDirection=${correctSortDirection}&sortBy=${correctSortBy}`;
    const incorrectUrl_03: string = `${SETTINGS.POSTS_PATH}?pageSize=${correctPageSize}&pageNumber=${correctPageNumber}&sortDirection=${incorrectSortDirection}&sortBy=${correctSortBy}`;
    const incorrectUrl_04: string = `${SETTINGS.POSTS_PATH}?pageSize=${correctPageSize}&pageNumber=${correctPageNumber}&sortDirection=${correctSortDirection}&sortBy=${incorrectSortBy}`;
    await Promise.all([createPost(app), createPost(app)]);
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const getPostsListResponse_01: any = await getPostsList(app, incorrectUrl_01, testStatus);
    const getPostsListResponse_02: any = await getPostsList(app, incorrectUrl_02, testStatus);
    const getPostsListResponse_03: any = await getPostsList(app, incorrectUrl_03, testStatus);
    const getPostsListResponse_04: any = await getPostsList(app, incorrectUrl_04, testStatus);
    const getPostsListResponse_05: PaginatedPostsListOutputDTO = await getPostsList(app, correctUrl);

    expect(getPostsListResponse_05.items).toBeInstanceOf(Array);
    expect(getPostsListResponse_05.items.length).toBe(2);
    expect(getPostsListResponse_05.totalCount).toBe(2);
    expect(getPostsListResponse_01.errorsMessages[0].field).toBe('pageSize');
    expect(getPostsListResponse_01.errorsMessages[0].message).toBe('Page size must be between 1 and 100');
    expect(getPostsListResponse_02.errorsMessages[0].field).toBe('pageNumber');
    expect(getPostsListResponse_02.errorsMessages[0].message).toBe('Page number must be a positive integer');
    expect(getPostsListResponse_03.errorsMessages[0].field).toBe('sortDirection');
    expect(getPostsListResponse_03.errorsMessages[0].message).toBe('Sort direction must be one of: asc, desc');
    expect(getPostsListResponse_04.errorsMessages[0].field).toBe('sortBy');

    expect(getPostsListResponse_04.errorsMessages[0].message).toBe(
      'Invalid sort field. Allowed values: createdAt, title, shortDescription, content, blogId, blogName'
    );
  });

  it('❌ 005 should not update a post by ID without proper basic authorization; PUT /api/posts/:id', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const createdPost: PostOutputDTO = await createPost(app, undefined, createdBlogId);
    const createdPostId: string = createdPost.id;

    await updatePostById(app, createdPostId, createdBlogId, undefined, HttpStatuses.Unauthorized_401, 'token');
    const getPostByIdResponse: PostOutputDTO = await getPostById(app, createdPostId);

    expect(getPostByIdResponse).toEqual(createdPost);
  });

  it('❌ 006 should not update a post by incorrect ID; PUT /api/posts/:id', async () => {
    const incorrectPostId_01: string = 'ABC';
    const incorrectPostId_02: number = 2;
    const incorrectPostId_03: null = null;
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const createdPost: PostOutputDTO = await createPost(app, undefined, createdBlogId);
    const createdPostId: string = createdPost.id;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const updatePostByIdResponse_01: any = await updatePostById(
      app,
      incorrectPostId_01,
      createdBlogId,
      undefined,
      testStatus
    );

    const updatePostByIdResponse_02: any = await updatePostById(
      app,
      incorrectPostId_02,
      createdBlogId,
      undefined,
      testStatus
    );

    const updatePostByIdResponse_03: any = await updatePostById(
      app,
      incorrectPostId_03,
      createdBlogId,
      undefined,
      testStatus
    );

    const getPostByIdResponse: PostOutputDTO = await getPostById(app, createdPostId);

    expect(getPostByIdResponse).toEqual(createdPost);
    expect(updatePostByIdResponse_01.errorsMessages[0].field).toBe('id');
    expect(updatePostByIdResponse_01.errorsMessages[0].message).toBe('Field "id" has incorrect format of ObjectId');
    expect(updatePostByIdResponse_02.errorsMessages[0].field).toBe('id');
    expect(updatePostByIdResponse_03.errorsMessages[0].message).toBe('Field "id" has incorrect format of ObjectId');
    expect(updatePostByIdResponse_03.errorsMessages[0].field).toBe('id');
    expect(updatePostByIdResponse_03.errorsMessages[0].message).toBe('Field "id" has incorrect format of ObjectId');
  });

  it('❌ 007 should not update a post by ID when incorrect body passed; PUT /api/posts/:id', async () => {
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
    const incorrectBlogId_01: number = 2;
    const incorrectBlogId_02: null = null;
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const createdPost: PostOutputDTO = await createPost(app, undefined, createdBlogId);
    const createdPostId: string = createdPost.id;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const updatePostByIdResponse_01: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { title: incorrectTitle_01 },
      testStatus
    );

    const updatePostByIdResponse_02: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { title: incorrectTitle_02 },
      testStatus
    );

    const updatePostByIdResponse_03: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { title: incorrectTitle_03 },
      testStatus
    );

    const updatePostByIdResponse_04: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { title: incorrectTitle_04 },
      testStatus
    );

    const updatePostByIdResponse_05: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { title: incorrectTitle_05 },
      testStatus
    );

    const updatePostByIdResponse_06: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { shortDescription: incorrectShortDescription_01 },
      testStatus
    );

    const updatePostByIdResponse_07: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { shortDescription: incorrectShortDescription_02 },
      testStatus
    );

    const updatePostByIdResponse_08: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { shortDescription: incorrectShortDescription_03 },
      testStatus
    );

    const updatePostByIdResponse_09: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { content: incorrectContent_01 },
      testStatus
    );

    const updatePostByIdResponse_10: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { content: incorrectContent_02 },
      testStatus
    );

    const updatePostByIdResponse_11: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { content: incorrectContent_03 },
      testStatus
    );

    const updatePostByIdResponse_12: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { blogId: incorrectBlogId_01 },
      testStatus
    );

    const updatePostByIdResponse_13: any = await updatePostById(
      app,
      createdPostId,
      createdBlogId,
      { blogId: incorrectBlogId_02 },
      testStatus
    );

    const getPostByIdResponse: PostOutputDTO = await getPostById(app, createdPostId);

    expect(getPostByIdResponse).toEqual(createdPost);
    expect(updatePostByIdResponse_01.errorsMessages[0].field).toBe('title');
    expect(updatePostByIdResponse_01.errorsMessages[0].message).toBe('Field "title" is too short or too long');
    expect(updatePostByIdResponse_02.errorsMessages[0].field).toBe('title');
    expect(updatePostByIdResponse_03.errorsMessages[0].message).toBe('Field "title" is too short or too long');
    expect(updatePostByIdResponse_03.errorsMessages[0].field).toBe('title');
    expect(updatePostByIdResponse_03.errorsMessages[0].message).toBe('Field "title" is too short or too long');
    expect(updatePostByIdResponse_04.errorsMessages[0].field).toBe('title');
    expect(updatePostByIdResponse_04.errorsMessages[0].message).toBe('Field "title" is too short or too long');
    expect(updatePostByIdResponse_05.errorsMessages[0].field).toBe('title');
    expect(updatePostByIdResponse_05.errorsMessages[0].message).toBe('Field "title" must be a string');
    expect(updatePostByIdResponse_06.errorsMessages[0].field).toBe('shortDescription');

    expect(updatePostByIdResponse_06.errorsMessages[0].message).toBe(
      'Field "shortDescription" is too short or too long'
    );

    expect(updatePostByIdResponse_07.errorsMessages[0].field).toBe('shortDescription');

    expect(updatePostByIdResponse_07.errorsMessages[0].message).toBe(
      'Field "shortDescription" is too short or too long'
    );

    expect(updatePostByIdResponse_08.errorsMessages[0].field).toBe('shortDescription');
    expect(updatePostByIdResponse_08.errorsMessages[0].message).toBe('Field "shortDescription" must be a string');
    expect(updatePostByIdResponse_09.errorsMessages[0].field).toBe('content');
    expect(updatePostByIdResponse_09.errorsMessages[0].message).toBe('Field "content" is too short or too long');
    expect(updatePostByIdResponse_10.errorsMessages[0].field).toBe('content');
    expect(updatePostByIdResponse_10.errorsMessages[0].message).toBe('Field "content" is too short or too long');
    expect(updatePostByIdResponse_11.errorsMessages[0].field).toBe('content');
    expect(updatePostByIdResponse_11.errorsMessages[0].message).toBe('Field "content" must be a string');
    expect(updatePostByIdResponse_12.errorsMessages[0].field).toBe('blogId');
    expect(updatePostByIdResponse_12.errorsMessages[0].message).toBe('Field "blogId" must be a string');
    expect(updatePostByIdResponse_13.errorsMessages[0].field).toBe('blogId');
    expect(updatePostByIdResponse_13.errorsMessages[0].message).toBe('Field "blogId" must be a string');
  });

  it('❌ 008 should not delete a post by ID without proper basic authorization; DELETE /api/posts/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;

    await deletePostById(app, createdPostId, HttpStatuses.Unauthorized_401, 'token');
    const getPostByIdResponse: PostOutputDTO = await getPostById(app, createdPostId);

    expect(getPostByIdResponse).toEqual(createdPost);
  });

  it('❌ 009 should not delete a post by incorrect ID; DELETE /api/posts/:id', async () => {
    const incorrectPostId_01: string = 'ABC';
    const incorrectPostId_02: number = 2;
    const incorrectPostId_03: null = null;
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const deletePostByIdResponse_01: any = await deletePostById(app, incorrectPostId_01, testStatus);
    const deletePostByIdResponse_02: any = await deletePostById(app, incorrectPostId_02, testStatus);
    const deletePostByIdResponse_03: any = await deletePostById(app, incorrectPostId_03, testStatus);
    const getPostByIdResponse: PostOutputDTO = await getPostById(app, createdPostId);

    expect(getPostByIdResponse).toEqual(createdPost);
    expect(deletePostByIdResponse_01.errorsMessages[0].field).toBe('id');
    expect(deletePostByIdResponse_01.errorsMessages[0].message).toBe('Field "id" has incorrect format of ObjectId');
    expect(deletePostByIdResponse_02.errorsMessages[0].field).toBe('id');
    expect(deletePostByIdResponse_03.errorsMessages[0].message).toBe('Field "id" has incorrect format of ObjectId');
    expect(deletePostByIdResponse_03.errorsMessages[0].field).toBe('id');
    expect(deletePostByIdResponse_03.errorsMessages[0].message).toBe('Field "id" has incorrect format of ObjectId');
  });

  it('❌ 010 should not create a comment for a post by ID without proper access token; POST /api/posts/:postId/comments', async () => {
    const incorrectAccessToken_01: string = '';
    const incorrectAccessToken_02: string = '   ';
    const incorrectAccessToken_03: string = 'token';
    const incorrectAccessToken_04: number = 2;
    const incorrectAccessToken_05: null = null;
    const incorrectAccessToken_06: undefined = undefined;
    const incorrectAccessToken_07: [] = [];
    const incorrectAccessToken_08: {} = {};
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const testStatus: HttpStatuses = HttpStatuses.Unauthorized_401;

    await createCommentInPost(app, createdPostId, incorrectAccessToken_01, undefined, testStatus);
    await createCommentInPost(app, createdPostId, incorrectAccessToken_02, undefined, testStatus);
    await createCommentInPost(app, createdPostId, incorrectAccessToken_03, undefined, testStatus);
    await createCommentInPost(app, createdPostId, incorrectAccessToken_04, undefined, testStatus);
    await createCommentInPost(app, createdPostId, incorrectAccessToken_05, undefined, testStatus);
    await createCommentInPost(app, createdPostId, incorrectAccessToken_06, undefined, testStatus);
    await createCommentInPost(app, createdPostId, incorrectAccessToken_07, undefined, testStatus);
    await createCommentInPost(app, createdPostId, incorrectAccessToken_08, undefined, testStatus);

    const getCommentsListByPostIdResponse: PaginatedCommentsListOutputDTO = await getCommentsListByPostId(
      app,
      createdPostId
    );

    expect(getCommentsListByPostIdResponse.items).toBeInstanceOf(Array);
    expect(getCommentsListByPostIdResponse.items.length).toBe(0);
    expect(getCommentsListByPostIdResponse.totalCount).toBe(0);
  });

  it('❌ 011 should not create a comment for a post by incorrect ID; POST /api/posts/:postId/comments', async () => {
    const incorrectPostId_01: string = '   ';
    const incorrectPostId_02: string = 'ABC';
    const incorrectPostId_03: number = 2;
    const incorrectPostId_04: null = null;
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

    const accessToken: string = await loginUser(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const createCommentInPostResponse_01: any = await createCommentInPost(
      app,
      incorrectPostId_01,
      accessToken,
      undefined,
      testStatus
    );

    const createCommentInPostResponse_02: any = await createCommentInPost(
      app,
      incorrectPostId_02,
      accessToken,
      undefined,
      testStatus
    );

    const createCommentInPostResponse_03: any = await createCommentInPost(
      app,
      incorrectPostId_03,
      accessToken,
      undefined,
      testStatus
    );

    const createCommentInPostResponse_04: any = await createCommentInPost(
      app,
      incorrectPostId_04,
      accessToken,
      undefined,
      testStatus
    );

    const getCommentsListByPostIdResponse: PaginatedCommentsListOutputDTO = await getCommentsListByPostId(
      app,
      createdPostId
    );

    expect(getCommentsListByPostIdResponse.items).toBeInstanceOf(Array);
    expect(getCommentsListByPostIdResponse.items.length).toBe(0);
    expect(getCommentsListByPostIdResponse.totalCount).toBe(0);
    expect(createCommentInPostResponse_01.errorsMessages[0].field).toBe('postId');

    expect(createCommentInPostResponse_01.errorsMessages[0].message).toBe(
      'Field "postId" has incorrect format of ObjectId'
    );

    expect(createCommentInPostResponse_02.errorsMessages[0].field).toBe('postId');

    expect(createCommentInPostResponse_03.errorsMessages[0].message).toBe(
      'Field "postId" has incorrect format of ObjectId'
    );

    expect(createCommentInPostResponse_03.errorsMessages[0].field).toBe('postId');

    expect(createCommentInPostResponse_03.errorsMessages[0].message).toBe(
      'Field "postId" has incorrect format of ObjectId'
    );

    expect(createCommentInPostResponse_04.errorsMessages[0].field).toBe('postId');

    expect(createCommentInPostResponse_04.errorsMessages[0].message).toBe(
      'Field "postId" has incorrect format of ObjectId'
    );
  });

  it('❌ 012 should not create a comment for a post by ID when incorrect body passed; POST /api/posts/:postId/comments', async () => {
    const incorrectCreateCommentInPostData_01: CreateCommentInPostInputDTO = { content: 'qwe123zxc' };
    const incorrectCreateCommentInPostData_02: CreateCommentInPostInputDTO = { content: '' };
    const incorrectCreateCommentInPostData_03: CreateCommentInPostInputDTO = { content: '   ' };
    const incorrectCreateCommentInPostData_04: CreateCommentInPostInputDTO = { content: 'ABC' };
    const incorrectCreateCommentInPostData_05: CreateCommentInPostInputDTO = { content: '1234567890' };
    const incorrectCreateCommentInPostData_06: { content: [] } = { content: [] };
    const incorrectCreateCommentInPostData_07: { content: {} } = { content: {} };
    const incorrectCreateCommentInPostData_08: { content: null } = { content: null };
    const incorrectCreateCommentInPostData_09: { content: undefined } = { content: undefined };
    const incorrectCreateCommentInPostData_10: { content: number } = { content: 1234567890 };
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

    const accessToken: string = await loginUser(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const createCommentInPostResponse_01: any = await createCommentInPost(
      app,
      createdPostId,
      accessToken,
      incorrectCreateCommentInPostData_01,
      testStatus
    );

    const createCommentInPostResponse_02: any = await createCommentInPost(
      app,
      createdPostId,
      accessToken,
      incorrectCreateCommentInPostData_02,
      testStatus
    );

    const createCommentInPostResponse_03: any = await createCommentInPost(
      app,
      createdPostId,
      accessToken,
      incorrectCreateCommentInPostData_03,
      testStatus
    );

    const createCommentInPostResponse_04: any = await createCommentInPost(
      app,
      createdPostId,
      accessToken,
      incorrectCreateCommentInPostData_04,
      testStatus
    );

    const createCommentInPostResponse_05: any = await createCommentInPost(
      app,
      createdPostId,
      accessToken,
      incorrectCreateCommentInPostData_05,
      testStatus
    );

    const createCommentInPostResponse_06: any = await createCommentInPost(
      app,
      createdPostId,
      accessToken,
      incorrectCreateCommentInPostData_06,
      testStatus
    );

    const createCommentInPostResponse_07: any = await createCommentInPost(
      app,
      createdPostId,
      accessToken,
      incorrectCreateCommentInPostData_07,
      testStatus
    );

    const createCommentInPostResponse_08: any = await createCommentInPost(
      app,
      createdPostId,
      accessToken,
      incorrectCreateCommentInPostData_08,
      testStatus
    );

    const createCommentInPostResponse_09: any = await createCommentInPost(
      app,
      createdPostId,
      accessToken,
      incorrectCreateCommentInPostData_09,
      testStatus
    );

    const createCommentInPostResponse_10: any = await createCommentInPost(
      app,
      createdPostId,
      accessToken,
      incorrectCreateCommentInPostData_10,
      testStatus
    );

    const getCommentsListByPostIdResponse: PaginatedCommentsListOutputDTO = await getCommentsListByPostId(
      app,
      createdPostId
    );

    expect(getCommentsListByPostIdResponse.items).toBeInstanceOf(Array);
    expect(getCommentsListByPostIdResponse.items.length).toBe(0);
    expect(getCommentsListByPostIdResponse.totalCount).toBe(0);
    expect(createCommentInPostResponse_01.errorsMessages[0].field).toBe('content');
    expect(createCommentInPostResponse_01.errorsMessages[0].message).toBe('Field "content" is too short or too long');
    expect(createCommentInPostResponse_02.errorsMessages[0].field).toBe('content');
    expect(createCommentInPostResponse_02.errorsMessages[0].message).toBe('Field "content" is too short or too long');
    expect(createCommentInPostResponse_03.errorsMessages[0].field).toBe('content');
    expect(createCommentInPostResponse_03.errorsMessages[0].message).toBe('Field "content" is too short or too long');
    expect(createCommentInPostResponse_04.errorsMessages[0].field).toBe('content');
    expect(createCommentInPostResponse_04.errorsMessages[0].message).toBe('Field "content" is too short or too long');
    expect(createCommentInPostResponse_05.errorsMessages[0].field).toBe('content');
    expect(createCommentInPostResponse_05.errorsMessages[0].message).toBe('Field "content" is too short or too long');
    expect(createCommentInPostResponse_06.errorsMessages[0].field).toBe('content');
    expect(createCommentInPostResponse_06.errorsMessages[0].message).toBe('Field "content" must be a string');
    expect(createCommentInPostResponse_07.errorsMessages[0].field).toBe('content');
    expect(createCommentInPostResponse_07.errorsMessages[0].message).toBe('Field "content" must be a string');
    expect(createCommentInPostResponse_08.errorsMessages[0].field).toBe('content');
    expect(createCommentInPostResponse_08.errorsMessages[0].message).toBe('Field "content" must be a string');
    expect(createCommentInPostResponse_09.errorsMessages[0].field).toBe('content');
    expect(createCommentInPostResponse_09.errorsMessages[0].message).toBe('Field "content" must be a string');
    expect(createCommentInPostResponse_10.errorsMessages[0].field).toBe('content');
    expect(createCommentInPostResponse_10.errorsMessages[0].message).toBe('Field "content" must be a string');
  });

  it('❌ 013 should not return a list of comments for a post by incorrect ID; GET /api/posts/:postId/comments', async () => {
    const incorrectPostId_01: string = '   ';
    const incorrectPostId_02: string = 'ABC';
    const incorrectPostId_03: number = 2;
    const incorrectPostId_04: null = null;
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

    const accessToken: string = await loginUser(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    await Promise.all([
      createCommentInPost(app, createdPostId, accessToken),
      createCommentInPost(app, createdPostId, accessToken),
    ]);

    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const getCommentsListByPostIdResponse_01: any = await getCommentsListByPostId(
      app,
      incorrectPostId_01,
      undefined,
      testStatus
    );

    const getCommentsListByPostIdResponse_02: any = await getCommentsListByPostId(
      app,
      incorrectPostId_02,
      undefined,
      testStatus
    );

    const getCommentsListByPostIdResponse_03: any = await getCommentsListByPostId(
      app,
      incorrectPostId_03,
      undefined,
      testStatus
    );

    const getCommentsListByPostIdResponse_04: any = await getCommentsListByPostId(
      app,
      incorrectPostId_04,
      undefined,
      testStatus
    );

    const getCommentsListByPostIdResponse_05: PaginatedCommentsListOutputDTO = await getCommentsListByPostId(
      app,
      createdPostId
    );

    expect(getCommentsListByPostIdResponse_05.items).toBeInstanceOf(Array);
    expect(getCommentsListByPostIdResponse_05.items.length).toBe(2);
    expect(getCommentsListByPostIdResponse_05.totalCount).toBe(2);
    expect(getCommentsListByPostIdResponse_01.errorsMessages[0].field).toBe('postId');

    expect(getCommentsListByPostIdResponse_01.errorsMessages[0].message).toBe(
      'Field "postId" has incorrect format of ObjectId'
    );

    expect(getCommentsListByPostIdResponse_02.errorsMessages[0].field).toBe('postId');

    expect(getCommentsListByPostIdResponse_03.errorsMessages[0].message).toBe(
      'Field "postId" has incorrect format of ObjectId'
    );

    expect(getCommentsListByPostIdResponse_03.errorsMessages[0].field).toBe('postId');

    expect(getCommentsListByPostIdResponse_03.errorsMessages[0].message).toBe(
      'Field "postId" has incorrect format of ObjectId'
    );

    expect(getCommentsListByPostIdResponse_04.errorsMessages[0].field).toBe('postId');

    expect(getCommentsListByPostIdResponse_04.errorsMessages[0].message).toBe(
      'Field "postId" has incorrect format of ObjectId'
    );
  });

  it('❌ 014 should not return a list of comments for a post by ID when incorrect pagination settings passed; GET /api/posts/:postId/comments', async () => {
    const correctPageSize: number = 5;
    const correctPageNumber: number = 1;
    const correctSortDirection: string = 'asc';
    const correctSortBy: string = 'content';
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const correctUrl: string = `${SETTINGS.POSTS_PATH}/${createdPostId}/comments?pageSize=${correctPageSize}&pageNumber=${correctPageNumber}&sortDirection=${correctSortDirection}&sortBy=${correctSortBy}`;
    const incorrectPageSize: number = 101;
    const incorrectPageNumber: number = -1;
    const incorrectSortDirection: string = 'cas';
    const incorrectSortBy: string = 'description';
    const incorrectUrl_01: string = `${SETTINGS.POSTS_PATH}/${createdPostId}/comments?pageSize=${incorrectPageSize}&pageNumber=${correctPageNumber}&sortDirection=${correctSortDirection}&sortBy=${correctSortBy}`;
    const incorrectUrl_02: string = `${SETTINGS.POSTS_PATH}/${createdPostId}/comments?pageSize=${correctPageSize}&pageNumber=${incorrectPageNumber}&sortDirection=${correctSortDirection}&sortBy=${correctSortBy}`;
    const incorrectUrl_03: string = `${SETTINGS.POSTS_PATH}/${createdPostId}/comments?pageSize=${correctPageSize}&pageNumber=${correctPageNumber}&sortDirection=${incorrectSortDirection}&sortBy=${correctSortBy}`;
    const incorrectUrl_04: string = `${SETTINGS.POSTS_PATH}/${createdPostId}/comments?pageSize=${correctPageSize}&pageNumber=${correctPageNumber}&sortDirection=${correctSortDirection}&sortBy=${incorrectSortBy}`;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    await createUser(app, createUserData);

    const accessToken: string = await loginUser(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    await Promise.all([
      createCommentInPost(app, createdPostId, accessToken),
      createCommentInPost(app, createdPostId, accessToken),
      createCommentInPost(app, createdPostId, accessToken),
      createCommentInPost(app, createdPostId, accessToken),
      createCommentInPost(app, createdPostId, accessToken),
      createCommentInPost(app, createdPostId, accessToken),
    ]);

    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const getCommentsListByPostIdResponse_01: any = await getCommentsListByPostId(
      app,
      createdPostId,
      incorrectUrl_01,
      testStatus
    );

    const getCommentsListByPostIdResponse_02: any = await getCommentsListByPostId(
      app,
      createdPostId,
      incorrectUrl_02,
      testStatus
    );

    const getCommentsListByPostIdResponse_03: any = await getCommentsListByPostId(
      app,
      createdPostId,
      incorrectUrl_03,
      testStatus
    );

    const getCommentsListByPostIdResponse_04: any = await getCommentsListByPostId(
      app,
      createdPostId,
      incorrectUrl_04,
      testStatus
    );

    const getCommentsListByPostIdResponse_05: PaginatedCommentsListOutputDTO = await getCommentsListByPostId(
      app,
      createdPostId,
      correctUrl
    );

    expect(getCommentsListByPostIdResponse_05.items).toBeInstanceOf(Array);
    expect(getCommentsListByPostIdResponse_05.items.length).toBe(5);
    expect(getCommentsListByPostIdResponse_05.totalCount).toBe(6);
    expect(getCommentsListByPostIdResponse_01.errorsMessages[0].field).toBe('pageSize');
    expect(getCommentsListByPostIdResponse_01.errorsMessages[0].message).toBe('Page size must be between 1 and 100');
    expect(getCommentsListByPostIdResponse_02.errorsMessages[0].field).toBe('pageNumber');
    expect(getCommentsListByPostIdResponse_02.errorsMessages[0].message).toBe('Page number must be a positive integer');
    expect(getCommentsListByPostIdResponse_03.errorsMessages[0].field).toBe('sortDirection');

    expect(getCommentsListByPostIdResponse_03.errorsMessages[0].message).toBe(
      'Sort direction must be one of: asc, desc'
    );

    expect(getCommentsListByPostIdResponse_04.errorsMessages[0].field).toBe('sortBy');

    expect(getCommentsListByPostIdResponse_04.errorsMessages[0].message).toBe(
      'Invalid sort field. Allowed values: createdAt, postId, content, commentatorInfo'
    );
  });
});
