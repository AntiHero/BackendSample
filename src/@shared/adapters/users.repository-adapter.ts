export abstract class UsersRepositoryAdapter<I, O> {
  public abstract create(data: I): Promise<O>;

  public abstract register(id: string): Promise<void | null>;
}
