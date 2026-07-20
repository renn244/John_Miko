import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { CustomValidationPipe } from 'src/CustomValidationPipe';
import { MediaPurpose } from '../media-policy';
import { CreateUploadSignatureDto } from './create-upload-signature.dto';

const metadata: ArgumentMetadata = {
  type: 'body',
  metatype: CreateUploadSignatureDto,
};

describe('CreateUploadSignatureDto', () => {
  const pipe = new CustomValidationPipe();

  it('keeps purpose and strips client-controlled upload parameters', async () => {
    const result = await pipe.transform(
      {
        purpose: MediaPurpose.PAYMENT_PROOF,
        publicId: 'public/attacker-selected-id',
        uploadPreset: 'unsigned-preset',
        uploadUrl: 'https://attacker.example/upload',
        visibility: 'public',
      },
      metadata,
    );

    expect(result).toEqual({ purpose: MediaPurpose.PAYMENT_PROOF });
  });

  it('rejects an unsupported purpose', async () => {
    await expect(
      pipe.transform({ purpose: 'ARBITRARY_UPLOAD' }, metadata),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
