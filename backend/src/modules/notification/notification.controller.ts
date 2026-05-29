import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { NotificationQueryDto } from './dto';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取通知列表' })
  findAll(
    @User('userId') userId: number,
    @Query() query: NotificationQueryDto,
  ) {
    return this.notificationService.findAllByUserId(userId, query.page, query.limit);
  }

  @Put(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '标记通知已读' })
  markAsRead(@User('userId') userId: number, @Param('id') id: string) {
    return this.notificationService.markAsRead(userId, +id);
  }

  @Put('read-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '标记所有通知已读' })
  markAllAsRead(@User('userId') userId: number) {
    return this.notificationService.markAllAsRead(userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除通知' })
  deleteNotification(@User('userId') userId: number, @Param('id') id: string) {
    return this.notificationService.deleteNotification(userId, +id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '清空所有通知' })
  deleteAllNotifications(@User('userId') userId: number) {
    return this.notificationService.deleteAllNotifications(userId);
  }
}
