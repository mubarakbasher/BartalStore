import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class UpdateFcmTokenDto {
  /**
   * The client's FCM registration token. Pass `null` to unregister
   * (e.g., on logout / token rotation) without touching the rest of the
   * profile. `@ValidateIf` skips the string/length check when the value
   * is `null`; `class-validator` rejects `undefined`.
   */
  @ApiProperty({
    nullable: true,
    description: 'FCM registration token, or null to unregister',
    example: 'fcm-token-string',
  })
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @MaxLength(4096)
  fcm_token!: string | null;
}
