export function getBlocClassName(inputText: string): string {
  let classname = inputText.replace(/[^\w]+/g, " ");
  classname = classname.replace(/_+/g, " ");
  classname = classname.trim();
  classname = classname.replace(/\s+([^\s])/g, (_, p1: string) => p1.toUpperCase());
  classname = classname.charAt(0).toUpperCase() + classname.slice(1);
  return classname;
}
