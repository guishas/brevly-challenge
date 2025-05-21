export class LinkAlreadyExistsError extends Error {
  constructor() {
    super('Shortened URL already exists.')
  }
}
