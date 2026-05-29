import { IsInt, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class NotificationQueryDto {
  @ApiPropertyOptional({ description: '页码' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页数量' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}

export class CreateNotificationDto {
  @ApiPropertyOptional({ description: '用户 ID' })
  @IsInt()
  userId: number;

  @ApiPropertyOptional({ description: '通知类型' })
  @IsOptional()
  type: string;

  @ApiPropertyOptional({ description: '通知内容' })
  @IsOptional()
  content: string;

  @ApiPropertyOptional({ description: '关联 ID' })
  @IsOptional()
  relatedId?: number;
}
