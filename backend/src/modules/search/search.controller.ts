import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: '搜索' })
  @ApiQuery({ name: 'q', required: true, description: '搜索关键词' })
  @ApiQuery({ name: 'type', required: false, description: '搜索类型 posts/users/tags' })
  search(
    @Query('q') query: string,
    @Query('type') type?: 'posts' | 'users' | 'tags',
  ) {
    return this.searchService.search(query, type);
  }
}
