import { IsNotEmpty, IsEmail, MinLength, IsString } from 'class-validator';

export interface LoginRequest {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

export interface LoginResponse {
  @IsString()
  accessToken: string;
  
  @IsString()
  refreshToken: string;
}

export interface LogoutRequest {
  @IsNotEmpty()
  @IsString()
  accessToken: string;
}

export interface RefreshTokenRequest {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export interface RefreshTokenResponse {
  @IsString()
  accessToken: string;
  @IsString()
  refreshToken: string;
}

export interface AuthorizeRequest {
  @IsNotEmpty()
  @IsString()
  accessToken: string;
}
