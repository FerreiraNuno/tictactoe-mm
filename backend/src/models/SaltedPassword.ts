export class SaltedPassword {
  constructor(
    public passwordHash: string,
    public salt: string
  ) {
  }
}