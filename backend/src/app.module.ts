import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { DynamoModule } from "./dynamo/dynamo.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [AuthModule, DynamoModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
