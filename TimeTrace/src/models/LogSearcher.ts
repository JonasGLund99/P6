import { MonaaZone } from './MonaaZone';
import { SearchInterval } from './SearchInterval';
import { extractTimeStamp } from "./helpers/extractTimeStamp";

export class LogSearcher {

    findZones(logFile: string[], SearchIntervals: SearchInterval[]): MonaaZone[] {
        console.time("findZones");
        let MonaaZoneMatches: MonaaZone[] = [];
        for (let i = 0; i < SearchIntervals.length; i++) {
            let foundmatch = new MonaaZone();
            logFile.forEach((line: string, lineIndex: number) => {
                let timestampISO: string = extractTimeStamp(line);
                const eventTimeStamp = new Date(timestampISO).getTime();
                if (eventTimeStamp >= SearchIntervals[i].start && eventTimeStamp <= SearchIntervals[i].end) {
                    foundmatch.lineMatches.push(lineIndex)
                }
            });
            MonaaZoneMatches.push(foundmatch);
        }
        console.timeEnd("findZones");
        return MonaaZoneMatches
    };
}
