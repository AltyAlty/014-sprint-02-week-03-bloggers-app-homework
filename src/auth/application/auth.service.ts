import { argon2Adapter } from '../adapters/argon2.adapter';
import { ResultStatuses } from '../../core/types/result/result-statuses';
import { Result } from '../../core/types/result/result.type';
import { jwtAdapter } from '../adapters/jwt.adapter';
import { usersService } from '../../users/application/users.service';
import { UserOutputDTO } from '../../users/routes/output-dto/user.output-dto';
import { CreateUserInputDTO } from '../../users/routes/input-dto/create-user.input-dto';
import { nodemailerAdapter } from '../adapters/nodemailer.adapter';
import { randomUUID } from 'crypto';
import { emailExamples } from '../email/email-examples';
import { EmailConfirmationType } from '../../users/application/types/user.type';
import { add } from 'date-fns/add';
import { SETTINGS } from '../../core/settings/settings';

/*Сервис "authService" для работы с аутентификацией.*/
export const authService = {
  /*Метод "loginUser()" для аутентификации пользователя по логину/email и паролю.*/
  async loginUser(loginOrEmail: string, password: string): Promise<Result<{ accessToken: string } | null>> {
    /*Просим сервис "authService" проверить подлинность логина/email и пароля пользователя.*/
    const checkedUserCredentialsResult = await this.checkUserCredentials(loginOrEmail, password);
    /*Если проверка не прошла успешно, то возвращаем ResultObject с информацией об этом.*/
    if (checkedUserCredentialsResult.status !== ResultStatuses.Ok) return checkedUserCredentialsResult as Result;
    /*Если проверка прошла успешно, то просим адаптер "jwtAdapter" создать AT.*/
    const accessToken: string = await jwtAdapter.createToken(checkedUserCredentialsResult.data!.id);

    /*Возвращаем ResultObject с AT.*/
    return {
      status: ResultStatuses.Ok,
      data: { accessToken },
      extensions: [],
    };
  },

  /*Метод "checkUserCredentials()" для проверки подлинности логина/email и пароля пользователя.*/
  async checkUserCredentials(loginOrEmail: string, password: string): Promise<Result<{ id: string } | null>> {
    /*Просим сервис "usersService" найти пользователя по логину/email.*/
    const userResult: Result<{ userOutputWithPasswordHash: UserOutputDTO & { passwordHash: string } } | null> =
      await usersService.findByLoginOrEmail(loginOrEmail);

    /*Если пользователь не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (userResult.status !== ResultStatuses.Ok) {
      return {
        status: ResultStatuses.Unauthorized,
        data: null,
        errorMessage: 'Unauthorized',
        extensions: [{ field: 'loginOrEmail', message: 'Unauthorized' }],
      };
    }

    /*Если пользователь был найден, то просим адаптер "argon2Adapter" проверить подлинность пароля.*/
    const isPasswordCorrect: boolean = await argon2Adapter.checkPassword(
      password,
      userResult.data!.userOutputWithPasswordHash.passwordHash
    );

    /*Если пароль не корректный, то возвращаем ResultObject с информацией об этом.*/
    if (!isPasswordCorrect) {
      return {
        status: ResultStatuses.Unauthorized,
        data: null,
        errorMessage: 'Unauthorized',
        extensions: [{ field: 'password', message: 'Unauthorized' }],
      };
    }

    /*Если с учетными данными нет проблем, то возвращаем ResultObject с информацией об этом.*/
    return {
      status: ResultStatuses.Ok,
      data: { id: userResult.data!.userOutputWithPasswordHash.id },
      extensions: [],
    };
  },

  /*Метод "registerUser()" для регистрации пользователя.*/
  async registerUser(
    dto: CreateUserInputDTO,
    emailAdapter = nodemailerAdapter
  ): Promise<Result<{ createdUserId: string }>> {
    /*Создаем объект с данными о подтверждении email.*/
    const newUserEmailConfirmationData: EmailConfirmationType = {
      isConfirmed: false,
      confirmationCode: randomUUID(),
      expirationDate: add(new Date(), SETTINGS.DEFAULT_CODE_EXPIRATION_TIME),
    };

    /*Просим сервис "usersService" создать пользователя.*/
    const createUserResult: Result<{ userId: string }> = await usersService.create(dto, newUserEmailConfirmationData);
    /*Получаем ID созданного пользователя.*/
    const createdUserId: string = createUserResult.data.userId;

    /*Просим адаптер "nodemailerAdapter" отправить письмо о подтверждении почты пользователю.*/
    await emailAdapter
      .sendMail(
        dto.email,
        'Complete Registration',
        newUserEmailConfirmationData.confirmationCode,
        emailExamples.completeRegistrationEmail
      )
      .catch(error => console.error('Failed to send a confirmation email: ', error));

    /*Если письмо было успешно отправлено, то возвращаем ResultObject с ID зарегистрированного пользователя.*/
    return {
      status: ResultStatuses.Created,
      data: { createdUserId },
      extensions: [],
    };
  },

  /*Метод "resendConfirmationEmail()" для повторной отправки письма для подтверждения регистрация пользователя.*/
  async resendConfirmationEmail(email: string, emailAdapter = nodemailerAdapter): Promise<Result<{} | null>> {
    /*Создаем объект с данными о подтверждении email.*/
    const newUserEmailConfirmationData: EmailConfirmationType = {
      isConfirmed: false,
      confirmationCode: randomUUID(),
      expirationDate: add(new Date(), SETTINGS.DEFAULT_CODE_EXPIRATION_TIME),
    };

    /*Просим сервис "usersService" изменить данные для подтверждения регистрации пользователя по email.*/
    const updateUserResult: Result<{} | null> = await usersService.updateEmailConfirmationByEmail(
      email,
      newUserEmailConfirmationData
    );

    /*Если данные для подтверждения регистрации пользователя не были изменены, то возвращаем ResultObject с информацией
    об этом.*/
    if (updateUserResult.status !== ResultStatuses.NoContent) return updateUserResult;

    /*Просим адаптер "nodemailerAdapter" повторно отправить письмо о подтверждении почты пользователю.*/
    await emailAdapter
      .sendMail(
        email,
        'Resending Complete Registration Mail',
        newUserEmailConfirmationData.confirmationCode,
        emailExamples.completeRegistrationEmail
      )
      .catch(error => console.error('Failed to resend a confirmation email: ', error));

    /*Если письмо было успешно отправлено, то возвращаем ResultObject с информацией об этом.*/
    return {
      status: ResultStatuses.NoContent,
      data: {},
      extensions: [],
    };
  },

  /*Метод "confirmEmail()" для подтверждения регистрации пользователя.*/
  async confirmUserByCode(code: string): Promise<Result<{} | null>> {
    /*Просим сервис "usersService" подтвердить регистрацию пользователя по коду.*/
    const confirmResult: Result<{} | null> = await usersService.confirmByCode(code);
    /*Если подтвердить регистрацию пользователя не удалось, то возвращаем ResultObject с информацией об этом.*/
    if (confirmResult.status !== ResultStatuses.NoContent) return confirmResult;

    /*Если подтвердить регистрацию пользователя удалось, то возвращаем ResultObject с информацией об этом.*/
    return {
      status: ResultStatuses.NoContent,
      data: {},
      extensions: [],
    };
  },
};
