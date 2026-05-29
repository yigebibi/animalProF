import { IsString, IsInt, IsOptional, MinLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: '内容' })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiPropertyOptional({ description: '父评论 ID' })
  @IsOptional()
  @IsInt()
  @Min(1)
  parentId?: number;
}
