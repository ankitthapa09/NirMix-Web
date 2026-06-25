export class ApiResponse<T> {
  public success: boolean;

  constructor(
    public statusCode: number,
    public data: T,
    public message: string = 'success'
  ) {
    this.success = statusCode < 400;
  }
}
