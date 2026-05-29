import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class FileService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async uploadFile(
    userId: number,
    file: Express.Multer.File,
    fileType: 'image' | 'video' | 'file' = 'image',
  ) {
    if (!file) {
      throw new BadRequestException('请选择文件');
    }

    // 验证文件大小
    const maxSize = fileType === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(`文件大小不能超过 ${maxSize / 1024 / 1024}MB`);
    }

    // 验证文件类型
    const allowedTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      video: ['video/mp4', 'video/webm'],
      file: ['application/pdf', 'text/plain'],
    };

    if (!allowedTypes[fileType].includes(file.mimetype)) {
      throw new BadRequestException('不支持的文件类型');
    }

    // 生成文件名
    const extension = path.extname(file.originalname);
    const fileName = `${Date.now()}-${crypto.randomBytes(16).toString('hex')}${extension}`;

    // 保存文件
    const uploadDir = this.configService.get<string>('UPLOAD_DIR') || './uploads';
    const datePath = new Date().toISOString().split('T')[0];
    const filePath = path.join(uploadDir, datePath);

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    const fullPath = path.join(filePath, fileName);
    fs.writeFileSync(fullPath, file.buffer);

    // 保存文件记录
    const fileRecord = await this.prisma.file.create({
      data: {
        userId,
        originalName: file.originalname,
        fileName,
        filePath: `/${datePath}/${fileName}`,
        fileSize: BigInt(file.size),
        mimeType: file.mimetype,
        fileType,
      },
    });

    const baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:3000';

    return {
      id: fileRecord.id,
      url: `${baseUrl}/uploads${fileRecord.filePath}`,
      fileName: fileRecord.originalName,
      fileSize: fileRecord.fileSize.toString(),
    };
  }

  async deleteFile(userId: number, fileId: number) {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new BadRequestException('文件不存在');
    }

    if (file.userId !== userId) {
      throw new BadRequestException('无权删除此文件');
    }

    // 删除文件记录
    await this.prisma.file.update({
      where: { id: fileId },
      data: { status: 0 },
    });

    // 删除物理文件（异步处理）
    const uploadDir = this.configService.get<string>('UPLOAD_DIR') || './uploads';
    const fullPath = path.join(uploadDir, file.filePath.substring(1));

    setTimeout(() => {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }, 1000);

    return { message: '文件已删除' };
  }

  async findUserFiles(userId: number, page: number = 1, limit: number = 20) {
    const [files, total] = await Promise.all([
      this.prisma.file.findMany({
        where: { userId, status: 1 },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.file.count({ where: { userId, status: 1 } }),
    ]);

    const baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:3000';

    return {
      data: files.map((f) => ({
        id: f.id,
        url: `${baseUrl}/uploads${f.filePath}`,
        fileName: f.originalName,
        fileSize: f.fileSize.toString(),
        mimeType: f.mimeType,
        fileType: f.fileType,
        createdAt: f.createdAt,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
