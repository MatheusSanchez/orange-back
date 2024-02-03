import { Prisma } from '@prisma/client'

const userAvatarUrlAndNameData = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: { avatar_url: true, name: true, surname: true },
})

const projectsWithUserData = Prisma.validator<Prisma.ProjectDefaultArgs>()({
  include: { user: userAvatarUrlAndNameData },
})

export type ProjectWithUserData = Prisma.ProjectGetPayload<
  typeof projectsWithUserData
>
