import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { AuthModule } from "./auth/auth.module";
import { DynamoModule } from "./dynamo/dynamo.module";
import { ConfigModule } from "@nestjs/config";
import { PlacesModule } from "./places/places.module";

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }), // Make the config global,
    DynamoModule,
    PlacesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
