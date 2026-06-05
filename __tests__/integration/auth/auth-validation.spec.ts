import 'dotenv/config';
import { getCreateUserInputDTO } from '../../utils/users/get-create-user-input-dto';
import { doBeforeTestsWithMongoMemoryServer } from '../../utils/common/do-before-tests';
import { CreateUserInputDTO } from '../../../src/users/routes/input-dto/create-user.input-dto';
import { nodemailerAdapter } from '../../../src/auth/adapters/nodemailer.adapter';
import { PaginatedUsersListOutputDTO } from '../../../src/users/routes/output-dto/paginated-users-list.output-dto';
import { getUsersList } from '../../utils/users/get-users-list';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { registerUser } from '../../utils/auth/register-user';
import { UserOutputDTO } from '../../../src/users/routes/output-dto/user.output-dto';
import { createUser } from '../../utils/users/create-user';
import { usersService } from '../../../src/users/application/users.service';
import { Result } from '../../../src/core/types/result/result.type';
import { UserDBType } from '../../../src/db/types/user-db.type';
import { usersRepository } from '../../../src/users/repositories/users.repository';
import { confirmUserByCode } from '../../utils/auth/confirm-user-by-code';
import { EmailConfirmationType } from '../../../src/users/types/user.type';
import { randomUUID } from 'crypto';
import { add } from 'date-fns/add';
import { resendConfirmationEmail } from '../../utils/auth/resend-confirmation-email';

describe('Auth Validation', () => {
  // const app = doBeforeTests();
  const app = doBeforeTestsWithMongoMemoryServer();

  it('❌ 001 should not register a user when incorrect body passed; POST /api/auth/registration', async () => {
    const incorrectLogin_01: string = '';
    const incorrectLogin_02: string = '   ';
    const incorrectLogin_03: string = '0123456789111111';
    const incorrectLogin_04: string = '!@#$%^&*()';
    const incorrectLogin_05: string = 'ab';
    const incorrectLogin_06: null = null;
    const incorrectPassword_01: string = '';
    const incorrectPassword_02: string = '   ';
    const incorrectPassword_03: string = '12345';
    const incorrectPassword_04: string = '012345678901234567890';
    const incorrectPassword_05: string = '01234567890123456789000000';
    const incorrectPassword_06: null = null;
    const incorrectEmail_01: string = '';
    const incorrectEmail_02: string = '   ';
    const incorrectEmail_03: string = 'user#example.com';
    const incorrectEmail_04: string = 'fd2xny8xnf';
    const incorrectEmail_05: null = null;
    const sendMailSpy = jest.spyOn(nodemailerAdapter, 'sendMail').mockImplementation(() => Promise.resolve(true));
    const createSpy = jest.spyOn(usersService, 'create');
    const confirmByCodeSpy = jest.spyOn(usersService, 'confirmByCode');
    const updateEmailConfirmationByEmailSpy = jest.spyOn(usersService, 'updateEmailConfirmationByEmail');
    const correctCreateUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const registerUserResponse_01: any = await registerUser(
      app,
      { ...correctCreateUserData, login: incorrectLogin_01 },
      testStatus
    );

    const registerUserResponse_02: any = await registerUser(
      app,
      { ...correctCreateUserData, login: incorrectLogin_02 },
      testStatus
    );

    const registerUserResponse_03: any = await registerUser(
      app,
      { ...correctCreateUserData, login: incorrectLogin_03 },
      testStatus
    );

    const registerUserResponse_04: any = await registerUser(
      app,
      { ...correctCreateUserData, login: incorrectLogin_04 },
      testStatus
    );

    const registerUserResponse_05: any = await registerUser(
      app,
      { ...correctCreateUserData, login: incorrectLogin_05 },
      testStatus
    );

    const registerUserResponse_06: any = await registerUser(
      app,
      { ...correctCreateUserData, login: incorrectLogin_06 },
      testStatus
    );

    const registerUserResponse_07: any = await registerUser(
      app,
      { ...correctCreateUserData, password: incorrectPassword_01 },
      testStatus
    );

    const registerUserResponse_08: any = await registerUser(
      app,
      { ...correctCreateUserData, password: incorrectPassword_02 },
      testStatus
    );

    const registerUserResponse_09: any = await registerUser(
      app,
      { ...correctCreateUserData, password: incorrectPassword_03 },
      testStatus
    );

    const registerUserResponse_10: any = await registerUser(
      app,
      { ...correctCreateUserData, password: incorrectPassword_04 },
      testStatus
    );

    const registerUserResponse_11: any = await registerUser(
      app,
      { ...correctCreateUserData, password: incorrectPassword_05 },
      testStatus
    );

    const registerUserResponse_12: any = await registerUser(
      app,
      { ...correctCreateUserData, password: incorrectPassword_06 },
      testStatus
    );

    const registerUserResponse_13: any = await registerUser(
      app,
      { ...correctCreateUserData, email: incorrectEmail_01 },
      testStatus
    );

    const registerUserResponse_14: any = await registerUser(
      app,
      { ...correctCreateUserData, email: incorrectEmail_02 },
      testStatus
    );

    const registerUserResponse_15: any = await registerUser(
      app,
      { ...correctCreateUserData, email: incorrectEmail_03 },
      testStatus
    );

    const registerUserResponse_16: any = await registerUser(
      app,
      { ...correctCreateUserData, email: incorrectEmail_04 },
      testStatus
    );

    const registerUserResponse_17: any = await registerUser(
      app,
      { ...correctCreateUserData, email: incorrectEmail_05 },
      testStatus
    );

    const getUsersListResponse: PaginatedUsersListOutputDTO = await getUsersList(app);

    expect(getUsersListResponse.items).toBeInstanceOf(Array);
    expect(getUsersListResponse.items.length).toBe(0);
    expect(getUsersListResponse.totalCount).toBe(0);
    expect(sendMailSpy).not.toHaveBeenCalled();
    expect(createSpy).not.toHaveBeenCalled();
    expect(confirmByCodeSpy).not.toHaveBeenCalled();
    expect(updateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();
    expect(registerUserResponse_01.errorsMessages[0].field).toBe('login');
    expect(registerUserResponse_01.errorsMessages[0].message).toBe('Field "login" is too short or too long');
    expect(registerUserResponse_02.errorsMessages[0].field).toBe('login');
    expect(registerUserResponse_02.errorsMessages[0].message).toBe('Field "login" is too short or too long');
    expect(registerUserResponse_03.errorsMessages[0].field).toBe('login');
    expect(registerUserResponse_03.errorsMessages[0].message).toBe('Field "login" is too short or too long');
    expect(registerUserResponse_04.errorsMessages[0].field).toBe('login');

    expect(registerUserResponse_04.errorsMessages[0].message).toBe(
      'Field "login" can only contain letters, numbers, underscores and hyphens'
    );

    expect(registerUserResponse_05.errorsMessages[0].field).toBe('login');
    expect(registerUserResponse_05.errorsMessages[0].message).toBe('Field "login" is too short or too long');
    expect(registerUserResponse_06.errorsMessages[0].field).toBe('login');
    expect(registerUserResponse_06.errorsMessages[0].message).toBe('Field "login" must be a string');
    expect(registerUserResponse_07.errorsMessages[0].field).toBe('password');
    expect(registerUserResponse_07.errorsMessages[0].message).toBe('Field "password" is too short or too long');
    expect(registerUserResponse_08.errorsMessages[0].field).toBe('password');
    expect(registerUserResponse_08.errorsMessages[0].message).toBe('Field "password" is too short or too long');
    expect(registerUserResponse_09.errorsMessages[0].field).toBe('password');
    expect(registerUserResponse_09.errorsMessages[0].message).toBe('Field "password" is too short or too long');
    expect(registerUserResponse_10.errorsMessages[0].field).toBe('password');
    expect(registerUserResponse_10.errorsMessages[0].message).toBe('Field "password" is too short or too long');
    expect(registerUserResponse_11.errorsMessages[0].field).toBe('password');
    expect(registerUserResponse_11.errorsMessages[0].message).toBe('Field "password" is too short or too long');
    expect(registerUserResponse_12.errorsMessages[0].field).toBe('password');
    expect(registerUserResponse_12.errorsMessages[0].message).toBe('Field "password" must be a string');
    expect(registerUserResponse_13.errorsMessages[0].field).toBe('email');
    expect(registerUserResponse_13.errorsMessages[0].message).toBe('Field "email" has wrong format');
    expect(registerUserResponse_14.errorsMessages[0].field).toBe('email');
    expect(registerUserResponse_14.errorsMessages[0].message).toBe('Field "email" has wrong format');
    expect(registerUserResponse_15.errorsMessages[0].field).toBe('email');
    expect(registerUserResponse_15.errorsMessages[0].message).toBe('Field "email" has wrong format');
    expect(registerUserResponse_16.errorsMessages[0].field).toBe('email');
    expect(registerUserResponse_16.errorsMessages[0].message).toBe('Field "email" has wrong format');
    expect(registerUserResponse_17.errorsMessages[0].field).toBe('email');
    expect(registerUserResponse_17.errorsMessages[0].message).toBe('Field "email" must be a string');
    sendMailSpy.mockRestore();
    createSpy.mockRestore();
    confirmByCodeSpy.mockRestore();
    updateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 002 should not register a user when non-unique login/email passed; POST /api/auth/registration', async () => {
    const correctCreateUserData: CreateUserInputDTO = {
      login: 'user01',
      password: 'qwe123ZXC456',
      email: 'user01@example.com',
    };

    const incorrectCreateUserData_01: CreateUserInputDTO = { ...correctCreateUserData, email: 'user02@example.com' };
    const incorrectCreateUserData_02: CreateUserInputDTO = { ...correctCreateUserData, login: 'user03' };
    const sendMailSpy = jest.spyOn(nodemailerAdapter, 'sendMail').mockImplementation(() => Promise.resolve(true));
    const createSpy = jest.spyOn(usersService, 'create');
    const confirmByCodeSpy = jest.spyOn(usersService, 'confirmByCode');
    const updateEmailConfirmationByEmailSpy = jest.spyOn(usersService, 'updateEmailConfirmationByEmail');
    const createdUser: UserOutputDTO = await createUser(app, correctCreateUserData);
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const registerUserResponse_01: any = await registerUser(app, incorrectCreateUserData_01, testStatus);
    const registerUserResponse_02: any = await registerUser(app, incorrectCreateUserData_02, testStatus);
    const getUsersListResponse: PaginatedUsersListOutputDTO = await getUsersList(app);

    expect(getUsersListResponse.items).toBeInstanceOf(Array);
    expect(getUsersListResponse.items.length).toBe(1);
    expect(getUsersListResponse.totalCount).toBe(1);
    expect(getUsersListResponse.items[0]).toEqual(createdUser);
    expect(sendMailSpy).not.toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(confirmByCodeSpy).not.toHaveBeenCalled();
    expect(updateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();
    expect(registerUserResponse_01.errorsMessages[0].field).toBe('login');
    expect(registerUserResponse_01.errorsMessages[0].message).toBe('Field "login" must be unique');
    expect(registerUserResponse_02.errorsMessages[0].field).toBe('email');
    expect(registerUserResponse_02.errorsMessages[0].message).toBe('Field "email" must be unique');
    sendMailSpy.mockRestore();
    createSpy.mockRestore();
    confirmByCodeSpy.mockRestore();
    updateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 003 should not confirm user registration when incorrect confirmation code passed; POST /api/auth/registration-confirmation', async () => {
    const incorrectConfirmationCode_01: string = '';
    const incorrectConfirmationCode_02: string = '   ';
    const incorrectConfirmationCode_03: string = '0123456789111111';
    const incorrectConfirmationCode_04: string = '!@#$%^&*()';
    const incorrectConfirmationCode_05: string = 'ab';
    const incorrectConfirmationCode_06: null = null;
    const incorrectConfirmationCode_07: undefined = undefined;
    const incorrectConfirmationCode_08: number = 1234567890;
    const sendMailSpy = jest.spyOn(nodemailerAdapter, 'sendMail').mockImplementation(() => Promise.resolve(true));
    const createSpy = jest.spyOn(usersService, 'create');
    const confirmByCodeSpy = jest.spyOn(usersService, 'confirmByCode');
    const updateEmailConfirmationByEmailSpy = jest.spyOn(usersService, 'updateEmailConfirmationByEmail');
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUserLogin: string = createUserData.login;
    await registerUser(app, createUserData);
    const createdUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const confirmUserByCodeResponse_01: any = await confirmUserByCode(app, incorrectConfirmationCode_01, testStatus);
    const confirmUserByCodeResponse_02: any = await confirmUserByCode(app, incorrectConfirmationCode_02, testStatus);
    const confirmUserByCodeResponse_03: any = await confirmUserByCode(app, incorrectConfirmationCode_03, testStatus);
    const confirmUserByCodeResponse_04: any = await confirmUserByCode(app, incorrectConfirmationCode_04, testStatus);
    const confirmUserByCodeResponse_05: any = await confirmUserByCode(app, incorrectConfirmationCode_05, testStatus);
    const confirmUserByCodeResponse_06: any = await confirmUserByCode(app, incorrectConfirmationCode_06, testStatus);
    const confirmUserByCodeResponse_07: any = await confirmUserByCode(app, incorrectConfirmationCode_07, testStatus);
    const confirmUserByCodeResponse_08: any = await confirmUserByCode(app, incorrectConfirmationCode_08, testStatus);
    const notConfirmedUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);

    expect(createdUserDB!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(notConfirmedUserDB!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(sendMailSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(confirmByCodeSpy).not.toHaveBeenCalled();
    expect(updateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();
    expect(confirmUserByCodeResponse_01.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse_01.errorsMessages[0].message).toBe('Field "code" is required');
    expect(confirmUserByCodeResponse_02.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse_02.errorsMessages[0].message).toBe('Field "code" has wrong format');
    expect(confirmUserByCodeResponse_03.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse_03.errorsMessages[0].message).toBe('Field "code" has wrong format');
    expect(confirmUserByCodeResponse_04.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse_04.errorsMessages[0].message).toBe('Field "code" has wrong format');
    expect(confirmUserByCodeResponse_05.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse_05.errorsMessages[0].message).toBe('Field "code" has wrong format');
    expect(confirmUserByCodeResponse_06.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse_06.errorsMessages[0].message).toBe('Field "code" must be a string');
    expect(confirmUserByCodeResponse_07.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse_07.errorsMessages[0].message).toBe('Field "code" must be a string');
    expect(confirmUserByCodeResponse_08.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse_08.errorsMessages[0].message).toBe('Field "code" must be a string');
    sendMailSpy.mockRestore();
    createSpy.mockRestore();
    confirmByCodeSpy.mockRestore();
    updateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 004 should not confirm user registration without prior registration; POST /api/auth/registration-confirmation', async () => {
    const sendMailSpy = jest.spyOn(nodemailerAdapter, 'sendMail').mockImplementation(() => Promise.resolve(true));
    const createSpy = jest.spyOn(usersService, 'create');
    const confirmByCodeSpy = jest.spyOn(usersService, 'confirmByCode');
    const updateEmailConfirmationByEmailSpy = jest.spyOn(usersService, 'updateEmailConfirmationByEmail');
    const confirmationCodeAsValidUUID: string = '11111111-1111-1111-1111-111111111111';

    const confirmUserByCodeResponse: any = await confirmUserByCode(
      app,
      confirmationCodeAsValidUUID,
      HttpStatuses.BadRequest_400
    );

    expect(sendMailSpy).not.toHaveBeenCalled();
    expect(createSpy).not.toHaveBeenCalled();
    expect(confirmByCodeSpy).not.toHaveBeenCalled();
    expect(updateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();
    expect(confirmUserByCodeResponse.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse.errorsMessages[0].message).toBe('Field "code" is invalid');
    sendMailSpy.mockRestore();
    createSpy.mockRestore();
    confirmByCodeSpy.mockRestore();
    updateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 005 should not confirm already confirmed user registration; POST /api/auth/registration-confirmation', async () => {
    const sendMailSpy = jest.spyOn(nodemailerAdapter, 'sendMail').mockImplementation(() => Promise.resolve(true));
    const createSpy = jest.spyOn(usersService, 'create');
    const confirmByCodeSpy = jest.spyOn(usersService, 'confirmByCode');
    const updateEmailConfirmationByEmailSpy = jest.spyOn(usersService, 'updateEmailConfirmationByEmail');
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUserLogin: string = createUserData.login;
    await registerUser(app, createUserData);
    const createdUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    const createdUserConfirmationCode = createdUserDB!.emailConfirmation.confirmationCode;
    await confirmUserByCode(app, createdUserConfirmationCode);
    const confirmedUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);

    const confirmUserByCodeResponse = await confirmUserByCode(
      app,
      createdUserConfirmationCode,
      HttpStatuses.BadRequest_400
    );

    const twiceConfirmedUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    const twiceConfirmedUserConfirmationCode = twiceConfirmedUserDB!.emailConfirmation.confirmationCode;

    expect(sendMailSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(confirmByCodeSpy).toHaveBeenCalledTimes(1);
    expect(updateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();
    expect(createdUserDB!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(confirmedUserDB!.emailConfirmation.isConfirmed).toBeTruthy();
    expect(twiceConfirmedUserDB!.emailConfirmation.isConfirmed).toBeTruthy();
    expect(createdUserConfirmationCode).toBe(twiceConfirmedUserConfirmationCode);
    expect(confirmUserByCodeResponse.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse.errorsMessages[0].message).toBe('Registration has already been confirmed');
    sendMailSpy.mockRestore();
    createSpy.mockRestore();
    confirmByCodeSpy.mockRestore();
    updateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 006 should not confirm user registration by expired confirmation code; POST /api/auth/registration-confirmation', async () => {
    const sendMailSpy = jest.spyOn(nodemailerAdapter, 'sendMail').mockImplementation(() => Promise.resolve(true));
    const createSpy = jest.spyOn(usersService, 'create');
    const confirmByCodeSpy = jest.spyOn(usersService, 'confirmByCode');
    const updateEmailConfirmationByEmailSpy = jest.spyOn(usersService, 'updateEmailConfirmationByEmail');
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();

    const userEmailConfirmationData: EmailConfirmationType = {
      isConfirmed: false,
      confirmationCode: randomUUID(),
      expirationDate: add(new Date(), { seconds: -1 }),
    };

    const createdUserResult: Result<{ userId: string }> = await usersService.create(
      createUserData,
      userEmailConfirmationData
    );

    const createdUserId = createdUserResult.data.userId;
    const createdUserDB: UserDBType | null = await usersRepository.findById(createdUserId);
    const createdUserConfirmationCode = createdUserDB!.emailConfirmation.confirmationCode;

    const confirmUserByCodeResponse = await confirmUserByCode(
      app,
      createdUserConfirmationCode,
      HttpStatuses.BadRequest_400
    );

    const notConfirmedUserDB: UserDBType | null = await usersRepository.findById(createdUserId);

    expect(sendMailSpy).not.toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(confirmByCodeSpy).not.toHaveBeenCalled();
    expect(updateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();
    expect(createdUserDB!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(notConfirmedUserDB!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(confirmUserByCodeResponse.errorsMessages[0].field).toBe('code');
    expect(confirmUserByCodeResponse.errorsMessages[0].message).toBe('Confirmation code has expired');
    sendMailSpy.mockRestore();
    createSpy.mockRestore();
    confirmByCodeSpy.mockRestore();
    updateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 007 should not resend a confirmation code when incorrect confirmation email passed; POST /api/auth/registration-email-resending', async () => {
    const incorrectEmail_01: string = '';
    const incorrectEmail_02: string = '   ';
    const incorrectEmail_03: string = 'user#example.com';
    const incorrectEmail_04: string = 'fd2xny8xnf';
    const incorrectEmail_05: null = null;
    const sendMailSpy = jest.spyOn(nodemailerAdapter, 'sendMail').mockImplementation(() => Promise.resolve(true));
    const createSpy = jest.spyOn(usersService, 'create');
    const confirmByCodeSpy = jest.spyOn(usersService, 'confirmByCode');
    const updateEmailConfirmationByEmailSpy = jest.spyOn(usersService, 'updateEmailConfirmationByEmail');
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUserLogin: string = createUserData.login;
    await registerUser(app, createUserData);
    const createdUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    const testStatus: HttpStatuses = HttpStatuses.BadRequest_400;

    const resendConfirmationEmailResponse_01: any = await resendConfirmationEmail(app, incorrectEmail_01, testStatus);
    const resendConfirmationEmailResponse_02: any = await resendConfirmationEmail(app, incorrectEmail_02, testStatus);
    const resendConfirmationEmailResponse_03: any = await resendConfirmationEmail(app, incorrectEmail_03, testStatus);
    const resendConfirmationEmailResponse_04: any = await resendConfirmationEmail(app, incorrectEmail_04, testStatus);
    const resendConfirmationEmailResponse_05: any = await resendConfirmationEmail(app, incorrectEmail_05, testStatus);
    const notConfirmedUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);

    expect(createdUserDB!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(notConfirmedUserDB!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(sendMailSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(confirmByCodeSpy).not.toHaveBeenCalled();
    expect(updateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();
    expect(resendConfirmationEmailResponse_01.errorsMessages[0].field).toBe('email');
    expect(resendConfirmationEmailResponse_01.errorsMessages[0].message).toBe('Field "email" has wrong format');
    expect(resendConfirmationEmailResponse_02.errorsMessages[0].field).toBe('email');
    expect(resendConfirmationEmailResponse_02.errorsMessages[0].message).toBe('Field "email" has wrong format');
    expect(resendConfirmationEmailResponse_03.errorsMessages[0].field).toBe('email');
    expect(resendConfirmationEmailResponse_03.errorsMessages[0].message).toBe('Field "email" has wrong format');
    expect(resendConfirmationEmailResponse_04.errorsMessages[0].field).toBe('email');
    expect(resendConfirmationEmailResponse_04.errorsMessages[0].message).toBe('Field "email" has wrong format');
    expect(resendConfirmationEmailResponse_05.errorsMessages[0].field).toBe('email');
    expect(resendConfirmationEmailResponse_05.errorsMessages[0].message).toBe('Field "email" must be a string');
    sendMailSpy.mockRestore();
    createSpy.mockRestore();
    confirmByCodeSpy.mockRestore();
    updateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 008 should not resend a confirmation code without prior registration; POST /api/auth/registration-email-resending', async () => {
    const sendMailSpy = jest.spyOn(nodemailerAdapter, 'sendMail').mockImplementation(() => Promise.resolve(true));
    const createSpy = jest.spyOn(usersService, 'create');
    const confirmByCodeSpy = jest.spyOn(usersService, 'confirmByCode');
    const updateEmailConfirmationByEmailSpy = jest.spyOn(usersService, 'updateEmailConfirmationByEmail');
    const correctEmail: string = 'user01@example.com';

    const resendConfirmationEmailResponse: any = await resendConfirmationEmail(
      app,
      correctEmail,
      HttpStatuses.BadRequest_400
    );

    expect(sendMailSpy).not.toHaveBeenCalled();
    expect(createSpy).not.toHaveBeenCalled();
    expect(confirmByCodeSpy).not.toHaveBeenCalled();
    expect(updateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();
    expect(resendConfirmationEmailResponse.errorsMessages[0].field).toBe('email');
    expect(resendConfirmationEmailResponse.errorsMessages[0].message).toBe('Field "email" is invalid');
    sendMailSpy.mockRestore();
    createSpy.mockRestore();
    confirmByCodeSpy.mockRestore();
    updateEmailConfirmationByEmailSpy.mockRestore();
  });

  it('❌ 009 should not resend a confirmation code for already confirmed user registration; POST /api/auth/registration-email-resending', async () => {
    const sendMailSpy = jest.spyOn(nodemailerAdapter, 'sendMail').mockImplementation(() => Promise.resolve(true));
    const createSpy = jest.spyOn(usersService, 'create');
    const confirmByCodeSpy = jest.spyOn(usersService, 'confirmByCode');
    const updateEmailConfirmationByEmailSpy = jest.spyOn(usersService, 'updateEmailConfirmationByEmail');
    const createUserData: CreateUserInputDTO = getCreateUserInputDTO();
    const createdUserLogin: string = createUserData.login;
    const createdUserEmail: string = createUserData.email;
    await registerUser(app, createUserData);
    const createdUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);
    const createdUserConfirmationCode = createdUserDB!.emailConfirmation.confirmationCode;
    await confirmUserByCode(app, createdUserConfirmationCode);
    const confirmedUserDB: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);

    const resendConfirmationEmailResponse = await resendConfirmationEmail(
      app,
      createdUserEmail,
      HttpStatuses.BadRequest_400
    );

    const confirmedUserDBAfterResending: UserDBType | null = await usersRepository.findByLoginOrEmail(createdUserLogin);

    const confirmedUserDBAfterResendingConfirmationCode =
      confirmedUserDBAfterResending!.emailConfirmation.confirmationCode;

    expect(sendMailSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(confirmByCodeSpy).toHaveBeenCalledTimes(1);
    expect(updateEmailConfirmationByEmailSpy).not.toHaveBeenCalled();
    expect(createdUserDB!.emailConfirmation.isConfirmed).toBeFalsy();
    expect(confirmedUserDB!.emailConfirmation.isConfirmed).toBeTruthy();
    expect(confirmedUserDBAfterResending!.emailConfirmation.isConfirmed).toBeTruthy();
    expect(createdUserConfirmationCode).toBe(confirmedUserDBAfterResendingConfirmationCode);
    expect(resendConfirmationEmailResponse.errorsMessages[0].field).toBe('email');
    expect(resendConfirmationEmailResponse.errorsMessages[0].message).toBe('Registration has already been confirmed');
    sendMailSpy.mockRestore();
    createSpy.mockRestore();
    confirmByCodeSpy.mockRestore();
    updateEmailConfirmationByEmailSpy.mockRestore();
  });
});
