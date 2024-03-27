import { useState, useEffect, useContext } from "react";
import { AppdataContext } from "../context/AppContext";
import { FileLine, mapEventsToFileLine } from '../models/Types/FileLine';

type LogTableProps = {
    mappingsAreEditable: boolean;
};

function LogTable({ mappingsAreEditable }: LogTableProps) {
    const { events, setEvents } = useContext(AppdataContext);
    const { mappings, setMappings } = useContext(AppdataContext);
    const { fileLines, setFileLines } = useContext(AppdataContext);
    const { matches, setMatches } = useContext(AppdataContext);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(0);
    const [monaaMatchIndex, setMonaaMatchIndex] = useState<number>(0);
    const [filteredFileLines, setFilteredFileLines] = useState<FileLine[]>(mapEventsToFileLine(events));
    const linesPerPage = 100;
    const [shownLines, setShownLines] = useState<FileLine[]>(filteredFileLines.slice(0, linesPerPage));

    useEffect(() => {
        setFilteredFileLines(mapEventsToFileLine(events));
    }, [events]);

    useEffect(() => {
        setShownLines(filteredFileLines.slice(0, linesPerPage));
        setCurrentPage(0);
        const logTable = document.querySelector("#log-table");
        if (logTable) logTable.scrollTop = 0;
    }, [filteredFileLines]);

    useEffect(() => {
        const logTable = document.querySelector("#log-table");
        if (!logTable) return;

        const firstLineMatched = document.querySelector(".bg-yellow-200") as HTMLElement;
        if (!firstLineMatched) return;

        if (firstLineMatched) logTable.scrollTop = firstLineMatched.offsetTop;
    }, [monaaMatchIndex]);

    useEffect(() => {
        if (currentPage !== 0) {
            setShownLines(shownLines => [...shownLines, ...(filteredFileLines.slice(linesPerPage * currentPage, linesPerPage * (currentPage + 1)))]);
        }
    }, [currentPage]);

    useEffect(() => {
        const logTable = document.querySelector("#log-table");
        if (!logTable) return;
        logTable.addEventListener('scroll', handleScroll);
        return () => {
            logTable.removeEventListener('scroll', handleScroll);
        };
    }, [currentPage]);

    function searchLog(query: string) {
        if (query === "") {
            setFilteredFileLines(mapEventsToFileLine(events));
            return;
        };

        let filteredFileLines: FileLine[] = [];

        fileLines.filter((fileLine, index) => {
            const isAMatch: boolean = fileLine.toLowerCase().includes(query.toLowerCase());
            if (!isAMatch) return false;
            filteredFileLines.push({ text: events[index], line: index });
            return true;
        });

        setFilteredFileLines(filteredFileLines);
    }

    const handleScroll = () => {
        const logTable = document.querySelector("#log-table");
        if (!logTable) return;
        const scrollY = logTable.scrollTop;
        const windowHeight = logTable.clientHeight;
        const documentHeight = logTable.scrollHeight;
        if (scrollY + windowHeight >= documentHeight - 100) {
            setCurrentPage(currentPage + 1);
        }
    };

    function handleMappingChange(eventText: string, mappingIndex: number): void {
        const inputValue = eventText;

        // Filter out characters that are not in the range of 'a' to 'y' || 'A' to 'Y'
        const lastChar = inputValue.slice(-1);
        const filteredValue = lastChar.search(/[a-yA-Y]/gi) === 0 ? lastChar : "";

        // EventText is empty when the user has removed the mapping.
        if (filteredValue === "" && eventText !== "") return;
        const mapKey = events[mappingIndex];
        mappings.set(mapKey, filteredValue);
        const newMappings = new Map(mappings);
        if (mappingsAreEditable) {
            setMappings(newMappings);
        }
    }

    function removeMapping(eventIndex: number): void {
        handleMappingChange("", eventIndex);
    }

    function classNames(...classes: String[]) {
        return classes.filter(Boolean).join(" ");
    }

    function lineIsHighlighted(line: number): boolean {
        if (mappingsAreEditable || !matches[monaaMatchIndex]) return false;
        let highlightLine = false;

        matches[monaaMatchIndex].lineMatches.forEach(match => {
            if (match === line) highlightLine = true;
        });
        return highlightLine;
    }

    return (
        <div id="fixed-container" className="flex flex-col content-center w-full h-full">
            <div id="top-log-table-title-container" className="flex p-1">
                <h2 className="font-bold text-md w-[20%]">Event</h2>
                <div id="search-container" className="flex flex-col content-center w-[60%]">
                    <h2 className="font-bold text-md">Search for event</h2>
                    <input
                        type="text"
                        className="px-2 border-2 border-gray-300 rounded-lg"
                        placeholder="Search for event"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            searchLog(e.target.value);
                        }}
                    ></input>
                </div>
                <h2 className="font-bold justify-self-end text-end text-md w-[20%]">Mapped value</h2>
            </div>
            <div id="log-table" className="relative flex h-full pt-0 overflow-auto border-2 border-gray-300 rounded-md">
                <div id="lineNumber-container" className="sticky left-0">
                    {/* Display line numbers here */}
                    {shownLines.map((fileLine: FileLine) => {
                        return <pre key={fileLine.line} className={classNames(
                            lineIsHighlighted(fileLine.line)
                                ? "bg-yellow-200"
                                : "even:bg-white odd:bg-gray-100",
                            "py-2 pl-3"
                        )}>{`${fileLine.line}: `}  </pre>;
                    })}
                </div>
                <div className="flex flex-col grow">
                    {filteredFileLines.length === 0 ? (
                        <h3 className="self-center text-2xl font-medium text-center align">
                            No events were found.
                        </h3>
                    ) : null}
                    {shownLines.map((fileLine: FileLine, i: number) => {
                        return <pre key={i} className={classNames(
                            lineIsHighlighted(fileLine.line)
                                ? "bg-yellow-200"
                                : "even:bg-white odd:bg-gray-100",
                            "w-full py-2 "
                        )}>{`${fileLines[fileLine.line]}`} </pre>;
                    })}
                </div>
                <div className="sticky right-0 flex flex-col mapping-container">
                    {shownLines.map((fileLine: FileLine) => {
                        return (
                            <div key={fileLine.line} className={classNames(
                                lineIsHighlighted(fileLine.line)
                                    ? "bg-yellow-200"
                                    : "even:bg-white odd:bg-gray-100",
                                "flex items-center justify-end gap-1 py-2 pl-2 pr-1")}>
                                <input
                                    className="w-6 h-6 text-center border-2 border-gray-300 rounded-md"
                                    type="text"
                                    readOnly={mappingsAreEditable ? false : true}
                                    value={mappings.get(fileLine.text) || ''}
                                    onChange={(event) => {
                                        handleMappingChange(event.target.value, fileLine.line);
                                    }}
                                />
                                {mappingsAreEditable ? (
                                    <svg
                                        onClick={() => {
                                            removeMapping(fileLine.line);
                                        }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5 cursor-pointer"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                        />
                                    </svg>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>
            {!mappingsAreEditable && matches.length > 0 && (
                <div id="matches-buttons" className="w-full h-[10%] flex flex-row justify-center gap-20">
                    <button onClick={() => { setMonaaMatchIndex(monaaMatchIndex === 0 ? 0 : monaaMatchIndex - 1) }}>
                        Previous match
                    </button>
                    <button onClick={() => { setMonaaMatchIndex(monaaMatchIndex === matches.length - 1 ? monaaMatchIndex : monaaMatchIndex + 1) }}>
                        Next match
                    </button>
                </div>
            )}
        </div>
    );
}

export default LogTable;
