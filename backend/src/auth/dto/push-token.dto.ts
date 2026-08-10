import { Matches } from 'class-validator';

export class PushTokenDto {
  @Matches(/^(Expo|Exponent)PushToken\[[^\]]+\]$/, {
    message: 'A valid Expo push token is required',
  })
  expoPushToken!: string;
}
