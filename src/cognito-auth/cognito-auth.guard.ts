import {
  Injectable, 
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private jwks: any;

  constructor(private configService: ConfigService) {
    const region = this.configService.get('AWS_REGION');
    const userPoolId = this.configService.get('COGNITO_USER_POOL_ID');
    
    if (!region || !userPoolId) {
      throw new Error('AWS_REGION o COGNITO_USER_POOL_ID no están configurados');
    }
    // URL de JWKS de Cognito
    const jwksUri = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
    //console.log(`Inicializando JWKS desde: ${jwksUri}`);
    this.jwks = createRemoteJWKSet(new URL(jwksUri), {
      // Tiempo máximo para esperar la respuesta al obtener la clave (por ejemplo, 5 segundos)
      timeoutDuration: 5000,
      // Tiempo máximo que se mantiene en cache la respuesta JWKS (por ejemplo, 1 hora)
      cacheMaxAge: 3600000,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Determinar si es HTTP o WebSocket
    const isWs = context.getType() === 'ws';
    const client = isWs 
      ? context.switchToWs().getClient() 
      : context.switchToHttp().getRequest();

    //console.log(`Tipo de conexión: ${isWs ? 'WebSocket' : 'HTTP'}`);
    
    let token: string   | null = null;

    if (isWs) {
      // Priorizar token desde auth (WebSocket)
      token = client.handshake.auth.token;
      
      // Si no está en auth, intentar desde headers
      if (!token) {
        const authHeader = client.handshake.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
          token = authHeader.split(' ')[1];
        }
      }
    } else {
      // HTTP estándar
      const authHeader = client.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      console.error('No se encontró token');
      throw isWs 
        ? new WsException('Missing or invalid token') 
        : new UnauthorizedException('Missing or invalid token');
    }

    try {
      //console.log('Iniciando verificación del token...');
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: `https://cognito-idp.${this.configService.get('AWS_REGION')}.amazonaws.com/${this.configService.get('COGNITO_USER_POOL_ID')}`,
        audience: this.configService.get('COGNITO_CLIENT_ID'), // Valida el client_id
      });
      //console.log('Token verificado:', payload);
     // Validar estructura del payload
      if (!payload.sub || !payload.email) {
        //console.error('Token inválido: falta sub o email');
        throw new UnauthorizedException('Invalid token structure');
      }
      if (!payload['cognito:groups']) {
        //console.error('Token inválido: no contiene cognito:groups');
        throw new UnauthorizedException('Token no contiene roles (no es un accessToken)');
      }
      // Extraer roles de cognito:groups
      const roles = payload['cognito:groups'] || [];
      console.log('Roles extraídos:', roles);
      console.log('Email del usuario:', payload.email);
      console.log('ID de usuario:', payload.sub);
      const user = {
        userId: payload.sub,
        email: payload.email,
        roles: roles,
      };
      if (isWs) {
        client.data.user = user;
      } else {
        client.user = user;
      }
      //console.log('Usuario autenticado:', user);
      return true;
    } catch (error) {
      console.error('Error al verificar token:', error);
      const message = error.code === 'ERR_JWT_EXPIRED' 
      ? 'Token expirado' 
      : 'Token inválido'
      throw isWs
        ? new WsException('Invalid token')
        : new UnauthorizedException('Invalid token');
    }
  }
}
