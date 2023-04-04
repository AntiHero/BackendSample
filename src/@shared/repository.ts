export abstract class Repository<I, O> {
  public abstract create(data: I): Promise<O>;
}
