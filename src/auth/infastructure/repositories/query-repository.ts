export abstract class QueryRepository<_, O> {
  public abstract findByEmail(data: string): Promise<O>;

  public abstract findByRecoveryOrConfirmationCode(code: string): Promise<O>;
}
