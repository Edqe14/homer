import { get, set } from 'lodash-es';

export default class GetSet<T extends object> {
  public readonly data: T;

  constructor(data: T) {
    this.data = data;
  }

  get(): T;

  get<P extends Path<T>>(path: P): PathValue<T, P>;

  get<P extends Path<T>>(path?: P): PathValue<T, P> | T {
    if (path) {
      return get(this.data, path);
    }

    return this.data;
  }

  set(path: Path<T>, value: PathValue<T, Path<T>>): void {
    set(this.data, path, value);
  }
}
