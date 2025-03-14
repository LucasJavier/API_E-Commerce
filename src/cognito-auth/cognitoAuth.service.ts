import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { ConfigService } from '@nestjs/config';
import { LoginAuthDto } from './dto/login.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { ConfirmAuthDto } from './dto/confirm.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class CognitoAuthService {
  private cognitoClient: CognitoIdentityProviderClient;
  private userPoolId: string;
  private clientId: string;

  constructor(private configService: ConfigService) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.userPoolId =
      this.configService.get<string>('COGNITO_USER_POOL_ID') ?? '';
    this.clientId = this.configService.get<string>('COGNITO_CLIENT_ID') ?? '';
  }

  async signUp(signUpDto: RegisterAuthDto): Promise<any> {
    try {
      const command = new SignUpCommand({
        ClientId: this.clientId,
        Username: signUpDto.email,
        Password: signUpDto.password,
        UserAttributes: [
          { Name: 'email', Value: signUpDto.email },
          { Name: 'preferred_username', Value: signUpDto.userName },
        ],
      });
      return await this.cognitoClient.send(command);
    } catch (error) {
      throw new BadRequestException(error.message || 'Sign-up failed');
    }
  }

  async confirmSignUp(confirmDto: ConfirmAuthDto): Promise<any> {
    try {
      const command = new ConfirmSignUpCommand({
        ClientId: this.clientId,
        Username: confirmDto.email,
        ConfirmationCode: confirmDto.pin,
      });
      return await this.cognitoClient.send(command);
    } catch (error) {
      throw new BadRequestException(error.message || 'Confirmation failed');
    }
  }

  async signIn(loginDto: LoginAuthDto): Promise<any> {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: this.clientId,
        AuthParameters: {
          USERNAME: loginDto.email,
          PASSWORD: loginDto.password,
        },
      });
      const response = await this.cognitoClient.send(command);
      return response.AuthenticationResult;
    } catch (error) {
      if (error.name === 'NotAuthorizedException') {
        throw new UnauthorizedException('Invalid credentials');
      } else if (error.name === 'UserNotFoundException') {
        throw new UnauthorizedException('User does not exist');
      } else {
        throw new InternalServerErrorException(
          error.message || 'Authentication failed',
        );
      }
    }
  }

  async refreshToken(refreshTokenDto: RefreshDto): Promise<any> {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: this.clientId,
        AuthParameters: {
          REFRESH_TOKEN: refreshTokenDto.refreshToken,
        },
      });

      const response = await this.cognitoClient.send(command);
      return {
        accessToken: response.AuthenticationResult?.AccessToken,
        idToken: response.AuthenticationResult?.IdToken,
        expiresIn: response.AuthenticationResult?.ExpiresIn,
      };
    } catch (error) {
      if (error.name === 'NotAuthorizedException') {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to refresh token',
      );
    }
  }
}
