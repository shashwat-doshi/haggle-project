import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  constructor() {}
  public getHello(userEmail: string): string {
    return "hello " + userEmail;
  }
}
