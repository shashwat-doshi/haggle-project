import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthDto } from "./dto";
import * as argon from "argon2"; // or alternatively, import { hash } from 'argon2', then just use hash()
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { DynamoService } from "src/dynamo/dynamo.service";

@Injectable({})
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private dynamoService: DynamoService,
  ) {}
  async login(dto: AuthDto) {
    const user = await this.dynamoService.getUser(dto.email);

    if (!user) {
      throw new ForbiddenException("Email does not exist");
    }

    const match = await argon.verify(user.passwordHash, dto.password);

    if (!match) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // prevent brute forcing
      throw new UnauthorizedException("Incorrect password");
    }

    return this.signToken(user.email);
  }
  async signup(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);
      await this.dynamoService.addUser(dto.email, hash);
      dto.password = null as any; // Explicitly clear password
      return this.signToken(dto.email);
    } catch (error) {
      if (error.name === "ConditionalCheckFailedException") {
        console.error("Error: User already exists!");
        throw new ForbiddenException("Email already taken");
      }
      console.error(error);
      throw new InternalServerErrorException("Internal server error"); // Handle other unexpected errors
    }
  }

  async signToken(email: string): Promise<{ access_token: string }> {
    const payload = {
      email: email,
    };
    const secret = this.configService.get("JWT_SECRET");
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: "15m",
        secret: secret,
      }),
    };
  }
}
