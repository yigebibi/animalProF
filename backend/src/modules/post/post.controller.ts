import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto, PostsQueryDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: '获取帖子列表' })
  findAll(@Query() query: PostsQueryDto) {
    return this.postService.findAll(query);
  }

  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取收藏的帖子' })
  getFavorites(@User('userId') userId: number, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.postService.getFavorites(userId, +page, +limit);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: '获取帖子详情' })
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '发布帖子' })
  create(@User('userId') userId: number, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(userId, createPostDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新帖子' })
  update(
    @User('userId') userId: number,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(userId, +id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除帖子' })
  remove(@User('userId') userId: number, @Param('id') id: string) {
    return this.postService.remove(userId, +id);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '点赞帖子' })
  likePost(@User('userId') userId: number, @Param('id') id: string) {
    return this.postService.likePost(userId, +id);
  }

  @Delete(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '取消点赞帖子' })
  unlikePost(@User('userId') userId: number, @Param('id') id: string) {
    return this.postService.unlikePost(userId, +id);
  }

  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '收藏帖子' })
  favoritePost(@User('userId') userId: number, @Param('id') id: string) {
    return this.postService.favoritePost(userId, +id);
  }

  @Delete(':id/favorite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '取消收藏帖子' })
  unfavoritePost(@User('userId') userId: number, @Param('id') id: string) {
    return this.postService.unfavoritePost(userId, +id);
  }

  @Get(':id/like/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '检查是否已点赞' })
  checkLikeStatus(@User('userId') userId: number, @Param('id') id: string) {
    return this.postService.checkLikeStatus(userId, +id);
  }

  @Get(':id/favorite/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '检查是否已收藏' })
  checkFavoriteStatus(@User('userId') userId: number, @Param('id') id: string) {
    return this.postService.checkFavoriteStatus(userId, +id);
  }
}
