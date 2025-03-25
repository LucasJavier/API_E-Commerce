import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  AdminAddUserToGroupCommand,
  GetUserCommand,
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
      // Agregar usuario
      const command = new SignUpCommand({
        ClientId: this.clientId,
        Username: signUpDto.email,
        Password: signUpDto.password,
        UserAttributes: [
          { Name: 'email', Value: signUpDto.email },
          { Name: 'preferred_username', Value: signUpDto.userName },
        ],
      });

      const response = await this.cognitoClient.send(command);

      // Agregar al usuario a un grupo
      const groupCommand = new AdminAddUserToGroupCommand({
        UserPoolId: this.userPoolId,
        Username: signUpDto.email,
        GroupName: signUpDto.role ?? 'Undefined',
      });

      await this.cognitoClient.send(groupCommand);

      return response;
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
        // Autenticación inicial
        const command = new InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: this.clientId,
            AuthParameters: {
                USERNAME: loginDto.email,
                PASSWORD: loginDto.password,
            },
        });

        const response = await this.cognitoClient.send(command);
        const tokens = response.AuthenticationResult;

        if (!tokens || !tokens.IdToken) {
            throw new UnauthorizedException('Authentication failed or no ID token');
        }

        // Decodificar el ID Token para obtener el usuario
        const decodedIdToken = this.decodeJWT(tokens.IdToken);
        const groups = decodedIdToken['cognito:groups']; // Obtener grupos/roles
        const userId = decodedIdToken.sub; // El ID del usuario en Cognito

        return {
            accessToken: tokens.AccessToken,
            idToken: tokens.IdToken,
            expiresIn: tokens.ExpiresIn,
            refreshToken: tokens.RefreshToken,
            role: groups ? groups[0] : 'Undefined', // Rol del usuario
            userId, // Agregado el ID del usuario
        };
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


  // Decodificar JWT (ID Token)
  private decodeJWT(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(Buffer.from(payload, 'base64').toString());
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
