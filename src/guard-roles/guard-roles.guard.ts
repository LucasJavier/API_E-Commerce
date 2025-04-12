import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    let user: any;
    if (context.getType() === 'ws') {
      const client = context.switchToWs().getClient();
      user = client.data.user;
    } else {
      user = context.switchToHttp().getRequest().user;
    }
    //console.log('User:', user); // Log the user object for debugging
    //console.log('Context:', context.getType()); // Log the context type for debugging

    // Check if the user has the required roles
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Filtrar targets válidos (evitar null/undefined)
    const targets = [
      context.getHandler(),
      context.getClass(),
    ].filter((target) => target !== null && target !== undefined);

    // Get the required roles from the handler
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      targets
    );
    //console.log('Roles requeridos:', requiredRoles);
    //console.log('Roles del usuario:', user.roles); 
    if (!requiredRoles?.length) return true; // If there are no required roles, we allow the access

    // Verificar al menos un rol requerido está presente
    const hasRole = requiredRoles.some((requiredRole) => 
      user.roles.includes(requiredRole)
    );
    //console.log('Has Role:', hasRole); // Log if the user has the required role

    if (!hasRole) {
      throw new ForbiddenException(
        `Required roles: ${requiredRoles.join(', ')}. Your roles: ${user.roles.join(', ')}`
      );
    }
    return true;
  }
}