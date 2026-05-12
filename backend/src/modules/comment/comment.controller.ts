import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('post/:postId')
  @Public()
  @ApiOperation({ summary: '获取帖子评论列表' })
  findAllByPostId(@Param('postId') postId: string) {
    return this.commentService.findAllByPostId(+postId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: '获取评论详情' })
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '发表评论' })
  create(
    @User('userId') userId: number,
    @Body() createCommentDto: CreateCommentDto & { postId: number },
  ) {
    const { postId, ...commentData } = createCommentDto;
    return this.commentService.create(userId, postId, commentData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新评论' })
  update(
    @User('userId') userId: number,
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(userId, +id, updateCommentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除评论' })
  remove(@User('userId') userId: number, @Param('id') id: string) {
    return this.commentService.remove(userId, +id);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '点赞评论' })
  likeComment(@User('userId') userId: number, @Param('id') id: string) {
    return this.commentService.likeComment(userId, +id);
  }

  @Delete(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '取消点赞评论' })
  unlikeComment(@User('userId') userId: number, @Param('id') id: string) {
    return this.commentService.unlikeComment(userId, +id);
  }

  @Get(':id/like/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '检查是否已点赞评论' })
  checkCommentLikeStatus(@User('userId') userId: number, @Param('id') id: string) {
    return this.commentService.checkCommentLikeStatus(userId, +id);
  }
}
