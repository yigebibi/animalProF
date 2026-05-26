import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ description: '重置令牌' })
  @IsString()
  token: string;

  @ApiProperty({ description: '新密码' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: '确认新密码' })
  @IsString()
  @MinLength(6)
  confirmPassword: string;
}
