import { toKebabCase } from './utils';

describe('toKebabcase', () => {
  it('should transform strings correctly', () => {
    expect(toKebabCase('Hello')).toBe('hello');
    expect(toKebabCase('hello')).toBe('hello');
    expect(toKebabCase('Hello World')).toBe('hello-world');
    expect(toKebabCase('HelloWorld')).toBe('hello-world');
    expect(toKebabCase('Hello-World')).toBe('hello-world');
    expect(toKebabCase('Hello  World')).toBe('hello-world');
  });
});
