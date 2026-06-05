import 'dotenv/config';
import { getCreateUserInputDTO } from '../../utils/users/get-create-user-input-dto';
import { doBeforeTests, doBeforeTestsWithMongoMemoryServer } from '../../utils/common/do-before-tests';
import { CreateUserInputDTO } from '../../../src/users/routes/input-dto/create-user.input-dto';
import { nodemailerAdapter } from '../../../src/auth/adapters/nodemailer.adapter';
import { authService } from '../../../src/auth/application/auth.service';
import { ResultStatuses } from '../../../src/core/types/result/result-statuses';
import { PaginatedUsersListOutputDTO } from '../../../src/users/routes/output-dto/paginated-users-list.output-dto';
import { getUsersList } from '../../utils/users/get-users-list';
import { emailExamples } from '../../../src/auth/email/email-examples';
import { usersService } from '../../../src/users/application/users.service';
import { usersRepository } from '../../../src/users/repositories/users.repository';
import { UserDBType } from '../../../src/db/types/user-db.type';
import { confirmUserByCode } from '../../utils/auth/confirm-user-by-code';
import { Result } from '../../../src/core/types/result/result.type';

describe('Auth', () => {
  // const app = doBeforeTests();
  const app = doBeforeTestsWithMongoMemoryServer();

  it('✅ 001 should register a user when correct body passed; POST /api/auth/registration', async () => {
    /*Моковый адаптер для работы с email.*/
    const mockEmailAdapter: jest.Mocked<typeof nodemailerAdapter> = { sendMail: jest.fn().mockResolvedValue(true) };
    /*Шпион для метода "usersService.create()".*/
    const createSpy = jest.spyOn(usersService, 'create');
    const confirmByCodeSpy = jest.spyOn(usersService, 'confirmByCode');
    const updateEmailConfirmationByEmailSpy = jest.spyOn(usersService, 'updateEmailConfirmationByEmail');
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();

    const registerUserResult: Result<{ createdUserId: string }> = await authService.registerUser(
      createUserData,
      mockEmailAdapter
    );

    const getUsersListResponse: PaginatedUsersListOutputDTO = await getUsersList(app);

    expect(registerUserResult.status).toBe(ResultStatuses.Created);
    expect(typeof registerUserResult.data.createdUserId).toBe('string');
    expect(registerUserResult.extensions).toBeInstanceOf(Array);
    expect(mockEmailAdapter.sendMail).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(confirmByCodeSpy).not.toHaveBeenCalled();
    expect(updateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    expect(mockEmailAdapter.sendMail).toHaveBeenCalledWith(
      createUserData.email,
      'Complete Registration',
      expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i),
      emailExamples.completeRegistrationEmail
    );

    expect(getUsersListResponse.items).toBeInstanceOf(Array);
    expect(getUsersListResponse.items.length).toBe(1);
    expect(getUsersListResponse.totalCount).toBe(1);
    expect(getUsersListResponse.items[0].login).toEqual(createUserData.login);
    expect(getUsersListResponse.items[0].email).toEqual(createUserData.email);
    /*Приводим шпиона для метода "usersService.create()" в изначальное состояния для использования в других тестах.*/
    createSpy.mockRestore();
    confirmByCodeSpy.mockRestore();
    updateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('✅ 002 should confirm user registration when correct confirmation code passed; POST /api/auth/registration-confirmation', async () => {
    const mockEmailAdapter: jest.Mocked<typeof nodemailerAdapter> = { sendMail: jest.fn().mockResolvedValue(true) };
    const createSpy = jest.spyOn(usersService, 'create');
    const confirmByCodeSpy = jest.spyOn(usersService, 'confirmByCode');
    const updateEmailConfirmationByEmailSpy = jest.spyOn(usersService, 'updateEmailConfirmationByEmail');
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();

    const registerUserResult: Result<{ createdUserId: string }> = await authService.registerUser(
      createUserData,
      mockEmailAdapter
    );

    const createdUserId: string = registerUserResult.data.createdUserId;
    const createdUserDB: UserDBType | null = await usersRepository.findById(createdUserId);
    const createdUserConfirmationCode = createdUserDB!.emailConfirmation.confirmationCode;

    await confirmUserByCode(app, createdUserConfirmationCode);
    const confirmedUserDB: UserDBType | null = await usersRepository.findById(createdUserId);

    expect(createdUserDB!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(confirmedUserDB!.emailConfirmation.isConfirmed).toBeTruthy();
    expect(mockEmailAdapter.sendMail).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(confirmByCodeSpy).toHaveBeenCalledTimes(1);
    expect(updateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();

    createSpy.mockRestore();
    confirmByCodeSpy.mockRestore();
    updateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('✅ 003 should resend a confirmation mail when correct email passed; POST /api/auth/registration-email-resending', async () => {
    const mockEmailAdapter: jest.Mocked<typeof nodemailerAdapter> = { sendMail: jest.fn().mockResolvedValue(true) };
    const createSpy = jest.spyOn(usersService, 'create');
    const confirmByCodeSpy = jest.spyOn(usersService, 'confirmByCode');
    const updateEmailConfirmationByEmailSpy = jest.spyOn(usersService, 'updateEmailConfirmationByEmail');
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUserEmail: string = createUserData.email;

    const registerUserResult: Result<{ createdUserId: string }> = await authService.registerUser(
      createUserData,
      mockEmailAdapter
    );

    const createdUserId: string = registerUserResult.data.createdUserId;
    const createdUserDBBeforeResending: UserDBType | null = await usersRepository.findById(createdUserId);
    const createdUserConfirmationCodeBeforeResending = createdUserDBBeforeResending!.emailConfirmation.confirmationCode;
    const createdUserExpirationDateBeforeResending = createdUserDBBeforeResending!.emailConfirmation.expirationDate;

    const resendConfirmationEmailResult: Result<{} | null> = await authService.resendConfirmationEmail(
      createdUserEmail,
      mockEmailAdapter
    );

    const createdUserDBAfterResending: UserDBType | null = await usersRepository.findById(createdUserId);
    const createdUserConfirmationCodeAfterResending = createdUserDBAfterResending!.emailConfirmation.confirmationCode;
    const createdUserExpirationDateAfterResending = createdUserDBAfterResending!.emailConfirmation.expirationDate;

    expect(createdUserDBBeforeResending!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(createdUserDBAfterResending!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(createdUserConfirmationCodeAfterResending).not.toBe(createdUserConfirmationCodeBeforeResending);
    expect(createdUserExpirationDateAfterResending).not.toBe(createdUserExpirationDateBeforeResending);
    expect(resendConfirmationEmailResult.status).toBe(ResultStatuses.NoContent);
    expect(resendConfirmationEmailResult.extensions).toBeInstanceOf(Array);
    expect(mockEmailAdapter.sendMail).toHaveBeenCalledTimes(2);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(confirmByCodeSpy).not.toHaveBeenCalled();
    expect(updateEmailConfirmationByEmailSpy).toHaveBeenCalledTimes(1);

    expect(mockEmailAdapter.sendMail).toHaveBeenCalledWith(
      createUserData.email,
      'Complete Registration',
      expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i),
      emailExamples.completeRegistrationEmail
    );

    expect(mockEmailAdapter.sendMail).toHaveBeenCalledWith(
      createUserData.email,
      'Resending Complete Registration Mail',
      expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i),
      emailExamples.completeRegistrationEmail
    );

    createSpy.mockRestore();
    confirmByCodeSpy.mockRestore();
    updateEmailConfirmationByEmailSpy.mockRestore();
  });
});
