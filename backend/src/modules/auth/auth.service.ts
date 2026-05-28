import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../../database/prisma.service';
import { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async sendPasswordResetEmail(email: string, resetUrl: string) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<string>('SMTP_PORT') || '587');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    const from = this.configService.get<string>('SMTP_FROM') || user;

    if (!host || !user || !pass || !from) {
      console.log(`Password reset link for ${email}: ${resetUrl}`);
      return;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from,
      to: email,
      subject: '宠物论坛密码重置',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
          <h2>重置密码</h2>
          <p>你收到这封邮件，是因为有人请求重置宠物论坛账户密码。</p>
          <p>请点击下面的链接完成密码重置：</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>该链接将在 1 小时后失效。如果这不是你的操作，请忽略这封邮件。</p>
        </div>
      `,
      text: `请访问以下链接重置密码：${resetUrl}`,
    });
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('密码错误');
    }

    if (user.status !== 1) {
      throw new UnauthorizedException('账户已被禁用');
    }

    const payload = { userId: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        nickname: user.nickname,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    // 检查用户是否已存在
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new ConflictException('用户名或邮箱已被使用');
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        nickname: username,
      },
    });

    // 生成 Token
    const payload = { userId: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
      },
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: forgotPasswordDto.email },
    });

    if (user) {
      const token = await this.jwtService.signAsync(
        {
          userId: user.id,
          purpose: 'password-reset',
        },
        { expiresIn: '1h' },
      );

      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3001';
      const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;
      await this.sendPasswordResetEmail(user.email, resetUrl);
    }

    return {
      message: '如果邮箱已注册，重置密码链接已发送',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password, confirmPassword } = resetPasswordDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('两次输入的密码不一致');
    }

    let payload: { userId: number; purpose?: string };

    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new BadRequestException('重置密码链接无效或已过期');
    }

    if (payload.purpose !== 'password-reset') {
      throw new BadRequestException('重置密码链接无效');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return { message: '密码重置成功' };
  }
}
