import { LogSearcher } from "../../models/LogSearcher";
import { SearchInterval } from "../../models/SearchInterval";
import { MonaaZone } from "../../models/MonaaZone";

describe('LogSearcher', () => {
    describe('findZones', () => {
        test('should return an array of zones', () => {
            // Arrange
            const logSearcher = new LogSearcher();
            const logFile = [
                "2024-02-26T08:22:34.000645Z login", // equals 1708935754000
                "2024-02-26T08:22:34.504645Z login", // equals 1708935754504
                "2024-02-26T08:22:35.082645Z delete",
                "2024-02-26T08:22:36.034645Z login",
                "2024-02-26T08:22:36.612645Z login",
                "2024-02-26T08:22:36.677645Z logout", // equals 1708935756677
                "2024-02-26T08:22:36.898645Z login",
                "2024-02-26T08:22:36.943645Z logout",
                "2024-02-26T08:22:37.801645Z login",
                "2024-02-26T08:22:38.584645Z edited",
                "2024-02-26T08:22:39.473645Z updated",
                "2024-02-26T08:22:39.951645Z logout",
                "2024-02-26T08:22:40.939645Z login",
                "2024-02-26T08:22:41.764645Z delete",
                "2024-02-26T08:22:42.169645Z logout"
            ];
            // https://codechi.com/dev-tools/date-to-millisecond-calculators/
            const searchIntervals : SearchInterval[] = [
                {start: 1708935754000, end: 1708935756677},
                {start: 1708935754504, end: 1708935756677}
            ]
            const expectedZones: MonaaZone[] = [
                {lineMatches: [0, 1, 2, 3, 4, 5]},
                {lineMatches: [1, 2, 3, 4, 5]}
            ]

            // Act
            const zones = logSearcher.findZones(logFile, searchIntervals);
            
            // Assert
            expect(zones).toEqual(expectedZones);
        });
    });
});