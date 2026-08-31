import { IsEmail } from 'class-validator';

export class getRestoreCandidateQueryDto {
  @IsEmail()
  email!: string;
}
