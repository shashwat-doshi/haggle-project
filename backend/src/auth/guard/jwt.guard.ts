import { AuthGuard } from '@nestjs/passport';

// just a renamer
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
