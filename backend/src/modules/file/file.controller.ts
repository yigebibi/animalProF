import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileService } from './file.service';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { User } from '../../common/decorators/user.decorator';

@ApiTags('files')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户文件列表' })
  findUserFiles(
    @User('userId') userId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.fileService.findUserFiles(userId, +page, +limit);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        fileType: {
          type: 'string',
          enum: ['image', 'video', 'file'],
          default: 'image',
        },
      },
    },
  })
  @ApiOperation({ summary: '上传文件' })
  uploadFile(
    @User('userId') userId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('fileType') fileType: 'image' | 'video' | 'file' = 'image',
  ) {
    return this.fileService.uploadFile(userId, file, fileType);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除文件' })
  deleteFile(@User('userId') userId: number, @Param('id') id: string) {
    return this.fileService.deleteFile(userId, +id);
  }
}
