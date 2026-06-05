import 'dotenv/config';
import { SETTINGS } from '../../../src/core/settings/settings';
import { UserOutputDTO } from '../../../src/users/routes/output-dto/user.output-dto';
import { createUser } from '../../utils/users/create-user';
import { doBeforeTests, doBeforeTestsWithMongoMemoryServer } from '../../utils/common/do-before-tests';
import { getUsersList } from '../../utils/users/get-users-list';
import { PaginatedUsersListOutputDTO } from '../../../src/users/routes/output-dto/paginated-users-list.output-dto';
import { deleteUserById } from '../../utils/users/delete-user-by-id';
import { PostOutputDTO } from '../../../src/posts/routes/output-dto/post.output-dto';
import { createPost } from '../../utils/posts/create-post';
import { CommentOutputDTO } from '../../../src/comments/routes/output-dto/comment.output-dto';
import { createCommentInPost } from '../../utils/posts/create-comment-in-post';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { CreateUserInputDTO } from '../../../src/users/routes/input-dto/create-user.input-dto';
import { getCreateUserInputDTO } from '../../utils/users/get-create-user-input-dto';
import { loginUser } from '../../utils/auth/login-user';
import { getPostById } from '../../utils/posts/get-post-by-id';
import { getCommentsListByPostId } from '../../utils/posts/get-comments-list-by-post-id';
import { getCommentById } from '../../utils/comments/get-comment-by-id';

describe('Users API', () => {
  // const app = doBeforeTests();
  const app = doBeforeTestsWithMongoMemoryServer();

  it('✅ 001 should create a user; POST /api/users', async () => {
    const createdUser: UserOutputDTO = await createUser(app);
    const getUsersListResponse: PaginatedUsersListOutputDTO = await getUsersList(app);

    expect(getUsersListResponse.items).toBeInstanceOf(Array);
    expect(getUsersListResponse.items.length).toBe(1);
    expect(getUsersListResponse.totalCount).toBe(1);
    expect(getUsersListResponse.items[0]).toEqual(createdUser);
  });

  it('✅ 002 should return a list of users; GET /api/users', async () => {
    await Promise.all([createUser(app), createUser(app)]);

    const getUsersListResponse: PaginatedUsersListOutputDTO = await getUsersList(app);

    expect(getUsersListResponse.items).toBeInstanceOf(Array);
    expect(getUsersListResponse.items.length).toBe(2);
    expect(getUsersListResponse.totalCount).toBe(2);
  });

  it('✅ 003 should return a list of users when correct pagination settings passed; GET /api/users', async () => {
    const pageSize: number = 5;
    const pageNumber: number = 1;
    const searchLoginTerm: string = 'i';
    const searchEmailTerm: string = 'abc';
    const sortDirection: string = 'asc';
    const sortBy: string = 'login';
    const url: string = `${SETTINGS.USERS_PATH}?pageSize=${pageSize}&pageNumber=${pageNumber}&searchLoginTerm=${searchLoginTerm}&searchEmailTerm=${searchEmailTerm}&sortDirection=${sortDirection}&sortBy=${sortBy}`;
    const userData_01: { login: string; email: string } = { login: 'John', email: 'moon@example.com' };
    const userData_02: { login: string; email: string } = { login: 'Abby', email: 'earth@example.com' };
    const userData_03: { login: string; email: string } = { login: 'Mike', email: 'pluto@example.com' };
    const userData_04: { login: string; email: string } = { login: 'Jim', email: 'mercury@example.abc' };
    const userData_05: { login: string; email: string } = { login: 'Kate', email: 'venus@example.com' };
    const userData_06: { login: string; email: string } = { login: 'Billy', email: 'satrun@example.abc' };

    await Promise.all([
      createUser(app, userData_01),
      createUser(app, userData_02),
      createUser(app, userData_03),
      createUser(app, userData_04),
      createUser(app, userData_05),
      createUser(app, userData_06),
    ]);

    const getUsersListResponse: PaginatedUsersListOutputDTO = await getUsersList(app, url);

    expect(getUsersListResponse.items).toBeInstanceOf(Array);
    expect(getUsersListResponse.items.length).toBe(3);
    expect(getUsersListResponse.totalCount).toBe(3);
    expect(getUsersListResponse.items[0].login).toBe(userData_06.login);
    expect(getUsersListResponse.items[1].login).toBe(userData_04.login);
    expect(getUsersListResponse.items[2].login).toBe(userData_03.login);
  });

  it('✅ 004 should delete a user by ID; DELETE /api/users/:id', async () => {
    const createdUser: UserOutputDTO = await createUser(app);
    const createdUserId: string = createdUser.id;

    await deleteUserById(app, createdUserId);
    const getUsersListResponse: PaginatedUsersListOutputDTO = await getUsersList(app);

    expect(getUsersListResponse.items).toBeInstanceOf(Array);
    expect(getUsersListResponse.items.length).toBe(0);
    expect(getUsersListResponse.totalCount).toBe(0);
  });

  it('✅ 005 should delete a user with their comments by ID; DELETE /api/users/:id', async () => {
    const createdPost: PostOutputDTO = await createPost(app);
    const createdPostId: string = createdPost.id;
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUser: UserOutputDTO = await createUser(app, createUserData);
    const createdUserId: string = createdUser.id;

    const accessToken: string = await loginUser(app, {
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });

    const createdComment_01: CommentOutputDTO = await createCommentInPost(app, createdPostId, accessToken);
    const createdComment_02: CommentOutputDTO = await createCommentInPost(app, createdPostId, accessToken);
    const createdCommentId_01: string = createdComment_01.id;
    const createdCommentId_02: string = createdComment_02.id;
    const testStatus: HttpStatuses = HttpStatuses.NotFound_404;

    await deleteUserById(app, createdUserId);
    const getUsersListResponse: PaginatedUsersListOutputDTO = await getUsersList(app);
    await getPostById(app, createdPostId);
    const getCommentsListByPostIdResponse = await getCommentsListByPostId(app, createdPostId);
    await getCommentById(app, createdCommentId_01, testStatus);
    await getCommentById(app, createdCommentId_02, testStatus);

    expect(getUsersListResponse.items).toBeInstanceOf(Array);
    expect(getUsersListResponse.items.length).toBe(0);
    expect(getUsersListResponse.totalCount).toBe(0);
    expect(getCommentsListByPostIdResponse.items).toBeInstanceOf(Array);
    expect(getCommentsListByPostIdResponse.items.length).toBe(0);
    expect(getCommentsListByPostIdResponse.totalCount).toBe(0);
  });
});
