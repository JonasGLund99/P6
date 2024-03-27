import { useContext, useEffect, useState } from "react";
import LogTable from "../components/LogTable";
import SearchForm from "../components/SearchForm";
import { QueryHandler } from "../models/QueryHandler";
import { AppdataContext } from "../context/AppContext";
import { LogFormatter } from "../models/LogFormatter";
import Loader from "../components/Loader";
import { getFileLines } from "../models/helpers/getFileLines";
import { FileLine, mapEventsToFileLine, mapFileLineToEvents } from "../models/Types/FileLine";
import { navigation } from "../components/Navbar";
import { MonaaZone } from "../models/MonaaZone";

function LogPage() {
    const { events } = useContext(AppdataContext);
    const { mappings } = useContext(AppdataContext);
    const { fileLines } = useContext(AppdataContext);
    const { uploadedFile } = useContext(AppdataContext);
    const { matches, setMatches } = useContext(AppdataContext);
    const { errorObj, setError } = useContext(AppdataContext);
    const queryHandler: QueryHandler = new QueryHandler();
    const [loading, setLoading] = useState<boolean>(false);
    const logFormatter = new LogFormatter();

    useEffect(() => {
        if (uploadedFile === null) {
            setError({
                title: "No file uploaded",
                errorString: "To be able to view the log and search, you must upload a file on the file upload page",
                callback: () => {
                    window.location.href = navigation.filter(x => x.name === "Create mappings")[0].href;
                },
                callbackTitle: "Go to Upload",
                is_dismissible: false
            });
        }
    }, [uploadedFile, setError]);


    const [filteredFileLines, setFilteredFileLines] = useState<FileLine[]>(mapEventsToFileLine(events));
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

    async function callMonaa(tre: string) {
        setLoading(true);
        if (!uploadedFile) return; //should never happen
        try {
            const formattedFile = await logFormatter.formatLog(uploadedFile, mappings);

            queryHandler.file = fileLines;
            queryHandler.formattedFile = await getFileLines(formattedFile);
            queryHandler.mappings = mappings;
            const monaaZones = await queryHandler.search(tre + "$");

            setMatches(monaaZones);
            setLoading(false);
        } catch (e) {
            setLoading(false)
            setError({
                title: "Error during regex search in file! Try searching again...",
                errorString: "An error occured during the timed regex search in the file <br /> <br />" + e,
                callback: null,
                callbackTitle: null,
                is_dismissible: true
            })
        }
    }

    return (
        <div id="log-page" className="h-full gap-5">
            <div className="h-[15%]">
                <h1 className="flex justify-center pb-5 text-4xl ">Search logfile {uploadedFile?.name}</h1>
                <SearchForm onSubmit={callMonaa} />
            </div>
            <div className="w-full h-[85%]">
                {loading ? <Loader /> :
                    <LogTable mappingsAreEditable={false} />
                }
            </div>
        </div>
    );
}

export default LogPage;
