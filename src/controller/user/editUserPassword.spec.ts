import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { createAndAuthenticateUser } from '../../utils/create-and-authenticate-user'

let userAuth: {
  token: string
  userId: string
}

describe('edit User Pass E2E', () => {
  beforeAll(async () => {
    await app.ready()
    userAuth = await createAndAuthenticateUser(app)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to edit a user pass', async () => {
    const editUserPassResponse = await request(app.server)
      .put(`/user/edit/pass`)
      .send({
        newPassword: 'newAwesomePassword',
        oldPassword: '12345678',
      })
      .set('Authorization', `Bearer ${userAuth.token}`)

    expect(editUserPassResponse.statusCode).toEqual(200)
    expect(editUserPassResponse.body.user).toEqual(
      expect.objectContaining({
        name: 'John',
        surname: 'Doe',
        email: 'johndoe@example.com',
        id: userAuth.userId,
      }),
    )

    const userData = await request(app.server)
      .post('/login')
      .send({ email: 'johndoe@example.com', password: 'newAwesomePassword' })

    expect(userData.statusCode).toEqual(200)
    expect(userData.body).toEqual({
      user: expect.any(Object),
      token: expect.any(String),
    })
  })

  it('should not be able to edit a user pass with the old pass wrong', async () => {
    const editUserPassResponse = await request(app.server)
      .put(`/user/edit/pass`)
      .send({
        newPassword: 'newAwesomePassword',
        oldPassword: 'WRONGPASS',
      })
      .set('Authorization', `Bearer ${userAuth.token}`)

    expect(editUserPassResponse.statusCode).toEqual(401)
    expect(editUserPassResponse.body).toEqual(
      expect.objectContaining({ error: 'Invalid old Password!' }),
    )
  })
})
