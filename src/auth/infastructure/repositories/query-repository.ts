export abstract class QueryRepository<_, O> {
  public abstract findByEmail(data: string): Promise<O>;
}
