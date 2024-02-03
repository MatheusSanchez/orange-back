import { User } from '@prisma/client'

import { ResourceNotFoundError } from '../errors/ResourceNotFoundError'
import { MultipartFile } from '@fastify/multipart'
import { randomUUID } from 'node:crypto'
import { env } from '../../env'
import path from 'node:path'
import fs from 'node:fs'
import { PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3'
import pump from 'pump'
import { AwsS3Error } from '../errors/AwsS3Error'
import { UserRepository } from '../../repositories/user-repository'

interface AddImageToUserUseCaseRequest {
  userId: string
  photo: MultipartFile
}

interface AddImageToUserUseCaseResponse {
  user: User
}

export class AddImageToUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
    photo,
  }: AddImageToUserUseCaseRequest): Promise<AddImageToUserUseCaseResponse> {
    const userToBeUpdated = await this.userRepository.findById(userId)

    if (!userToBeUpdated) {
      throw new ResourceNotFoundError()
    }

    const newFileName = randomUUID() + photo.filename.replace(/\s/g, '')
    let photoUrl = ''

    if (env.STORAGE_TYPE === 'local') {
      const uploadPath = path.resolve(__dirname, '..', 'tmp', 'uploads')
      const writeSteam = fs.createWriteStream(`${uploadPath}/${newFileName}`)
      await pump(photo.file, writeSteam)
      photoUrl = `${uploadPath}/${newFileName}`
    } else {
      const s3bucket = new S3Client({
        region: env.REGION,

        credentials: {
          accessKeyId: env.ACCESS_KEY_ID,
          secretAccessKey: env.SECRET_ACCESS_KEY,
        },
      } as S3ClientConfig)

      const putObjectCommand = new PutObjectCommand({
        Bucket: env.BUCKET_NAME,
        Key: newFileName,
        Body: await photo.toBuffer(),
        ContentType: photo.mimetype,
        ACL: 'public-read',
      })

      const publishs3Result = await s3bucket.send(putObjectCommand)

      if (publishs3Result.$metadata.httpStatusCode !== 200) {
        throw new AwsS3Error()
      }
      photoUrl = env.AWS_S3_URL + newFileName
    }

    const user = await this.userRepository.addPhotoUrl(userId, photoUrl)

    return { user }
  }
}
