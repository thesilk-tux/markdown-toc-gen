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
