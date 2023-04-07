export abstract class UseresQueryRepositoryAdapter<_, O> {
  public abstract findByEmail(data: string): Promise<O>;

  public abstract findByRecoveryOrConfirmationCode(code: string): Promise<O>;

  public abstract findById(id: string): Promise<O>;
}
