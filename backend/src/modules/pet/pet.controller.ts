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
import { PetService } from './pet.service';
import { CreatePetDto, UpdatePetDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('pets')
@Controller('pets')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户的宠物列表' })
  findAll(@User('userId') userId: number) {
    return this.petService.findAllByUserId(userId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: '获取宠物详情' })
  findOne(@Param('id') id: string) {
    return this.petService.findOne(+id);
  }

  @Get(':id/posts')
  @Public()
  @ApiOperation({ summary: '获取宠物的帖子' })
  findPetPosts(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.petService.findPetPosts(+id, +page, +limit);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '添加宠物' })
  create(@User('userId') userId: number, @Body() createPetDto: CreatePetDto) {
    return this.petService.create(userId, createPetDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新宠物信息' })
  update(
    @User('userId') userId: number,
    @Param('id') id: string,
    @Body() updatePetDto: UpdatePetDto,
  ) {
    return this.petService.update(userId, +id, updatePetDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除宠物' })
  remove(@User('userId') userId: number, @Param('id') id: string) {
    return this.petService.remove(userId, +id);
  }
}
