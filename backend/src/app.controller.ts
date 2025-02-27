import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { JwtGuard } from "./auth/guard";
import { Request as RequestType } from "express";

// Define the expected structure of the user object
interface AuthenticatedRequest extends RequestType {
  user: {
    email: string;
    passwordHash: string;
  };
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/ping")
  @UseGuards(JwtGuard)
  public getHello(@Request() req: AuthenticatedRequest): string {
    return this.appService.getHello(req.user.email);
  }
}
