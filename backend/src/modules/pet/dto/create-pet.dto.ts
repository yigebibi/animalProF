import { IsString, IsOptional, IsInt, Min, Max, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePetDto {
  @ApiProperty({ description: '宠物名字' })
  @IsString()
  name: string;

  @ApiProperty({ description: '宠物类型 如 狗 猫' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ description: '品种' })
  @IsString()
  @IsOptional()
  breed?: string;

  @ApiPropertyOptional({ description: '性别 0:未知 1:公 2:母' })
  @IsInt()
  @Min(0)
  @Max(2)
  @IsOptional()
  gender?: number;

  @ApiPropertyOptional({ description: '生日' })
  @IsDateString()
  @IsOptional()
  birthday?: string;

  @ApiPropertyOptional({ description: '头像 URL' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({ description: '简介' })
  @IsString()
  @IsOptional()
  bio?: string;
}
