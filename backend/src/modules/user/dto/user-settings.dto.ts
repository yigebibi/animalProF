import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsObject, ValidateNested } from 'class-validator';

export class NotificationSettingsDto {
  @ApiProperty()
  @IsBoolean()
  pushNotifications: boolean;

  @ApiProperty()
  @IsBoolean()
  emailNotifications: boolean;

  @ApiProperty()
  @IsBoolean()
  commentNotifications: boolean;

  @ApiProperty()
  @IsBoolean()
  likeNotifications: boolean;

  @ApiProperty()
  @IsBoolean()
  followNotifications: boolean;
}

export class PrivacySettingsDto {
  @ApiProperty()
  @IsBoolean()
  publicProfile: boolean;

  @ApiProperty()
  @IsBoolean()
  allowComments: boolean;

  @ApiProperty()
  @IsBoolean()
  allowLikes: boolean;

  @ApiProperty()
  @IsBoolean()
  allowFollows: boolean;
}

export class AccountSecuritySettingsDto {
  @ApiProperty()
  @IsBoolean()
  emailVerified: boolean;

  @ApiProperty()
  @IsBoolean()
  phoneVerified: boolean;

  @ApiProperty()
  @IsBoolean()
  twoFactorEnabled: boolean;
}

export class UpdateUserSettingsDto {
  @ApiProperty({ type: NotificationSettingsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => NotificationSettingsDto)
  notificationSettings: NotificationSettingsDto;

  @ApiProperty({ type: PrivacySettingsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => PrivacySettingsDto)
  privacySettings: PrivacySettingsDto;

  @ApiProperty({ type: AccountSecuritySettingsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => AccountSecuritySettingsDto)
  accountSecurity: AccountSecuritySettingsDto;
}
