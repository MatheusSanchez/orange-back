import { Project } from '@prisma/client'

import { ProjectRepository } from '../../repositories/project-repository'
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError'
import { MultipartFile } from '@fastify/multipart'
import { randomUUID } from 'node:crypto'
import { env } from '../../env'
import path from 'node:path'
import fs from 'node:fs'
import { PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3'
import pump from 'pump'
import { AwsS3Error } from '../errors/AwsS3Error'

interface AddImageToProjectUseCaseRequest {
  projectId: string
  photo: MultipartFile
}

interface AddImageToProjectUseCaseResponse {
  project: Project
}

export class AddImageToProjectUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    projectId,
    photo,
  }: AddImageToProjectUseCaseRequest): Promise<AddImageToProjectUseCaseResponse> {
    const projectToBeUpdated =
      await this.projectRepository.fetchProjectById(projectId)

    if (!projectToBeUpdated) {
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

    const project = await this.projectRepository.addPhotoUrl(
      projectId,
      photoUrl,
    )

    return { project }
  }
}
