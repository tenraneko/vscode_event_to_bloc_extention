import { getPartContent } from "./getPartContent";

export function getEventsFromParts(parts: string[], mainEventClass: string): string[] | undefined {
  const listOfEvents = [];

  for (const index in parts) {
    const part = parts[index];
    try {
      //^ Get content from part files
      const partContent = getPartContent(part);
      if (partContent == undefined) continue;

      //& Regex to find events
      var pattern = "\\.*(?<=class\\s)(\\w+)(?=\\sextends\\s" + mainEventClass + ")";
      var regex = new RegExp(pattern, "gm");

      //^ Add events to array
      const events = partContent.match(regex);
      if (events != undefined && events.length > 0) {
        listOfEvents.push(...events);
      }
    } catch (error) {
      return undefined;
    }
  }
  return listOfEvents.length > 0 ? listOfEvents : undefined;
}
