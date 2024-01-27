export class InvalidCredentialsError extends Error {
  constructor(message: string = 'Invalid credentials.') {
    super(message)
    this.name = 'InvalidCredentialsError'
  }
}
