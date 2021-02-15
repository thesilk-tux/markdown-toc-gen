/**
 * uses string array and create markdown conform string
 *
 * string.join("\n") is not possible because this method
 * adds a leading linebreak to each element with index > 0
 *
 * @param content - string array with markdown content
 * @returns markdown conform string
 */
export function toMarkdown(content: string[]): string {
  return content
    .map((val, idx) => {
      if (idx < content.length - 1) {
        return val + '\n';
      }
      return val;
    })
    .join('');
}
