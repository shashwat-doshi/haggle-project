import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "src/auth/strategy";
import { DynamoModule } from "src/dynamo/dynamo.module";
@Module({
  imports: [JwtModule.register({}), DynamoModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
