import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest(); //syntax to pull @Req
    if (data) {
      // passed into decorator
      return request.user[data];
    }
    return request.user; // remember that the strategy validator appends it to our request object
  },
);
