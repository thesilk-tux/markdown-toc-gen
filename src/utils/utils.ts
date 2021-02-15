/**
 * transform given string in kebab case
 * @param str - given string which should be transformed
 * @returns - transformed string
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}
