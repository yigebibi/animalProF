import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchQueryDto {
  @ApiPropertyOptional({ description: '搜索关键词' })
  @IsString()
  @IsOptional()
  q?: string = '';

  @ApiPropertyOptional({ description: '搜索类型', enum: ['post', 'user', 'tag', 'posts', 'users', 'tags'] })
  @IsString()
  @IsOptional()
  @IsIn(['post', 'user', 'tag', 'posts', 'users', 'tags'])
  type?: 'post' | 'user' | 'tag' | 'posts' | 'users' | 'tags';
}
