import { extractTimeStamp } from "./helpers/extractTimeStamp";
import { MonaaZone } from "./MonaaZone";
import { SearchInterval } from "./SearchInterval";

export class LogSearcher {
  findZones(logFile: string[], SearchIntervals: SearchInterval[]): MonaaZone[] {
    console.time("findZones");
    const MonaaZoneMatches: MonaaZone[] = [];
    const timestamps: number[] = [];
    let averageTimegrowth: number = 0;
    let prevLineTime: number = 0;

    logFile.forEach((line: string) => {
      const timestampISO: string = extractTimeStamp(line);
      const eventTimeStamp = new Date(timestampISO).getTime();
      timestamps.push(eventTimeStamp);
      averageTimegrowth =
        (averageTimegrowth + (eventTimeStamp - prevLineTime)) / 2;
      prevLineTime = eventTimeStamp;
    });

    for (let i = 0; i < SearchIntervals.length; i++) {
      let foundmatch = new MonaaZone();
      const firstTimestamp = timestamps[0];
      const difference = SearchIntervals[i].start - firstTimestamp;
      const multiplum = difference / averageTimegrowth;
      let startingIndex = Math.floor(multiplum);

      while (timestamps[startingIndex] > SearchIntervals[i].start) {
        startingIndex--;
      }

      // Using binary search to find the correct starting index
      const binarySearchResult = this.binarySearch(
        timestamps,
        SearchIntervals[i].start
      );
      startingIndex =
        binarySearchResult >= 0 ? binarySearchResult : startingIndex;

      for (let j = startingIndex; j < timestamps.length; j++) {
        const timestamp = timestamps[j];

        if (
          timestamp >= SearchIntervals[i].start &&
          timestamp <= SearchIntervals[i].end
        ) {
          foundmatch.lineMatches.push(j);
        } else if (timestamp > SearchIntervals[i].end) {
          break;
        }
      }
      MonaaZoneMatches.push(foundmatch);
    }
    console.timeEnd("findZones");
    console.log("MonaaZoneMatches ", MonaaZoneMatches.length);
    return MonaaZoneMatches;
  }

  // Binary search function to find the starting index
  binarySearch = (arr: number[], target: number): number => {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (arr[mid] === target) {
        return mid;
      } else if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    console.log(right);

    return right; // Returns the index of the element just before the target
  };
}
