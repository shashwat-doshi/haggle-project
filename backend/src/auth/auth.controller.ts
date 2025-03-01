import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

// endpoints are .../auth/[endpoint]
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  // Techincally, as a parameter you could write @Req req: Request and work with an Express-style request
  // Can also use @Body('email') email: string as a parameter if you want to extract fields named 'email' and so on csv
  // @UsePipes(new ValidationPipe()) if I wanted to do piping only locally
  @Post("signup")
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post("signin")
  signin(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }
}
