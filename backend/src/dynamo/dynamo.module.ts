import { Module } from "@nestjs/common";
import { DynamoService } from "./dynamo.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  providers: [DynamoService],
  exports: [DynamoService],
})
export class DynamoModule {}
