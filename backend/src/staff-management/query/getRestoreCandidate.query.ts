import { IsEmail } from 'class-validator';
import { NormalizeEmail } from 'src/lib/decorators/NormalizeEmail.decorator';

export class getRestoreCandidateQueryDto {
  @NormalizeEmail()
  @IsEmail()
  email!: string;
}
