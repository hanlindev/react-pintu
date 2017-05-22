export abstract class LogicContainer<T> {
  name = 'logic';
  abstract run(): Promise<T>;
}