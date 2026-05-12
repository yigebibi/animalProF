import { IsString, IsInt, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: '内容' })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiPropertyOptional({ description: '父评论 ID' })
  @IsInt()
  @IsInt()
  @MinLength(1)
  @ApiPropertyOptional({ description: '父评论 ID' })
  @IsInt()
  @ApiPropertyOptional({ description: '父评论 ID' })
  @IsInt()
  @ApiPropertyOptional({ description: '父评论 ID' })
  @IsInt()
  @ApiPropertyOptional({ description: '父评论 ID' })
  @IsInt()
  parentId?: number;
}
