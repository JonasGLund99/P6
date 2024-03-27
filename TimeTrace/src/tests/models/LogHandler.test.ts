import { LogHandler } from "../../models/LogHandler";
import { SearchInterval } from "../../models/SearchInterval";
import { MonaaZone } from "../../models/MonaaZone";

describe('LogHandler', () => {
    describe('mapMonaaOutputToSearchIntervals', () => {
        test('should return an array of MonaaZones', () => {
            // Arrange
            const logHandler = new LogHandler();
            const logFile = [
                "2024-02-26T08:22:34.000645Z login", 
                "2024-02-26T08:22:34.504645Z login", 
                "2024-02-26T08:22:35.082645Z delete",
                "2024-02-26T08:22:36.034645Z login",
                "2024-02-26T08:22:36.612645Z login",
                "2024-02-26T08:22:36.677645Z logout"
            ];
            // Converted to Monaa format:
            // A 1708935754000
            // A 1708935754504
            // Z 1708935755082
            // A 1708935756034
            // A 1708935756612
            // B 1708935756677

            //TRE: '(A(Z|A)*B)%(2400,2700)$'
            const monaaOutput = [
                "1708935753977.000000        < t < 1708935754000.000000",
                "1708935756677.000000        < t' <=        inf",
                "2677.000000        < t' - t <        inf",
                "=============================",
                "1708935754000.000000       <= t < 1708935754277.000000",
                "1708935756677.000000        < t' <=        inf",
                "2400.000000        < t' - t <=        inf",
                "============================="
            ];
            const expectedZones: MonaaZone[] = [
                {lineMatches: [0, 1, 2, 3, 4, 5]},
                {lineMatches: [1, 2, 3, 4, 5]}
            ]

            // Act
            const result = logHandler.mapMonaaOutputToEvent(monaaOutput, logFile);

            // Assert
            expect(result).toEqual(expectedZones);
        });
    });

    describe('extractSearchIntervals', () => {
        test('should return an array of searchIntervals', () => {
            // Arrange
            const logHandler = new LogHandler();
            const monaaOutput = [
                "-0.000000      <= t <   0.500000 ",
                "0.800000        < t' <=   1.500000 ",
                "0.300000        < t' - t <=   1.500000 ",
                "=========================== ",
                "1.500000       <= t <   2.000000 ",
                "3.200000        < t' <=   3.500000 ",
                "1.200000        < t' - t <=   2.000000 ",
                "==========================="
            ];
            const expectedSearchIntervals : SearchInterval[] = [
                {start: 0.5, end: 0.8},
                {start: 2.0, end: 3.2}
            ]

            // Act
            const searchIntervals = logHandler.extractSearchIntervals(monaaOutput);
            
            // Assert
            expect(searchIntervals).toEqual(expectedSearchIntervals);
        });
    });
});