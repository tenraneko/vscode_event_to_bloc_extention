export function getBlocFilename(inputText: string): string {
  let filename = inputText.replace(/[^\w]+/g, " ");
  filename = filename.replace(/_+/g, " ");
  filename = filename.replace(/([A-Z]+)/g, (_, p1) => " " + p1);
  filename = filename.trim();
  filename = filename.replace(/\s+/g, "_");
  filename = filename.toLowerCase();
  return filename;
}
