import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    // Check if the route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(), // Check method-level metadata
      context.getClass(), // Check controller-level metadata
    ]);

    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.access_token;

    console.log('Token:', token);

    if (isPublic) {
      return true; // Allow access to public routes
    }

    // Handle potential Observable from super.canActivate
    const result = super.canActivate(context);
    if (result instanceof Observable) {
      return result.toPromise(); // Convert Observable to Promise
    }

    return result; // Return boolean or Promise<boolean>
  }
}
