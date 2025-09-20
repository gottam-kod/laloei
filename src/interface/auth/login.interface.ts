export type LoginRequest = {
    username: string;
    password: string
};

export type LoginResponse = {
  access_token: string;
  refresh_token?: string;
  user?: any;
  // เพิ่ม field อื่น ๆ ตามจริง
};


export class ApiError extends Error {
  status: number;
  body?: any;
  constructor(message: string, status: number, body?: any) {
    super(message);
    this.status = status;
    this.body = body;
  }
}