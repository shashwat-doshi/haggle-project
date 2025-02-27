import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { DynamoService } from "src/dynamo/dynamo.service";
import { IUser } from "src/dynamo/types";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  //default name is 'jwt' anyway
  constructor(
    configService: ConfigService,
    private dynamoService: DynamoService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET"), // simply tries to match the jwt key with your secret key
    });
  }

  // note that this payload was signed in your signin and signup functions, so you should be extracting the same thing
  async validate(payload: { email: string }) {
    // Fetch user from DynamoDB using email
    const user = await this.dynamoService.getUser(payload.email);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return user as IUser; // Attach the full user object to req.user
  }
}
