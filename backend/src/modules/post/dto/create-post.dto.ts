import { IsString, IsOptional, IsInt, IsArray, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: '标题' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: '内容' })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiPropertyOptional({ description: '封面 URL' })
  @IsString()
  @IsOptional()
  coverUrl?: string;

  @ApiPropertyOptional({ description: '标签数组' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: '分类' })
  @IsString()
  @IsOptional()
  category?: string;
}
