import { IsString, IsOptional, IsInt, Min, Max, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: '用户名' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ description: '昵称' })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiPropertyOptional({ description: '个人简介' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ description: '性别 0:未知 1:男 2:女' })
  @IsInt()
  @Min(0)
  @Max(2)
  @IsOptional()
  gender?: number;

  @ApiPropertyOptional({ description: '生日' })
  @IsDateString()
  @IsOptional()
  birthday?: string;

  @ApiPropertyOptional({ description: '城市' })
  @IsString()
  @IsOptional()
  city?: string;
}
