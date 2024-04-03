interface Props {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    searchLog: (qry: string) => void;
}

function Searcher(props: Props) {
    const searchQuery = props.searchQuery;
    const setSearchQuery = props.setSearchQuery;
    const searchLog = props.searchLog;

    return (
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
    );
}

export default Searcher;