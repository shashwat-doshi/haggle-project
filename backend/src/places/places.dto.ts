export class PlacesListSuccessResponseDto<T> {
  type: string;
  message: string;
  data: T;

  constructor(message: string, data: T) {
    this.type = "success";
    this.message = message;
    this.data = data;
  }
}

export class PlacesListFailureResponseDto {
  type: string;
  error: any;
  message: string;
  code?: string;

  constructor(error: any, message: string, code?: string) {
    this.type = "error";
    this.error = error;
    this.message = message;
    this.code = code;
  }
}
