/**
 * transform given string in kebab case
 * @param str - given string which should be transformed
 * @returns - transformed string
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-zA-Z0-9-]*/g, '')
    .toLowerCase();
}

export enum Color {
  GREEN = '\x1b[32m',
  BLUE = '\x1b[34m',
  RED = '\x1b[31m',
  YELLOW = '\x1b[33m',
  MAGENTA = '\x1b[35m',
  WHITE = '\x1b[37m',
}

export function log(content: string, color: Color = Color.WHITE): void {
  console.log(`${color}%s\x1b[0m`, content);
}
