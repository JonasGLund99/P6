import { useEffect, useState } from "react";

function LogTable(props: LogTableProps) {
    const [mapping, setMapping] = useState<string>("");

    const handleMappingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        // Filter out characters that are not in the range of 'a' to 'z'
        const filteredValue = inputValue.replace(/[^a-yA-Y]]/gi, '');
        if(filteredValue === "") return;
        
        setMapping(filteredValue);
    };

return (
    <div className="flex">
        <span>
            2024-02-26T08:22:14.642Z some_event.xxxxxxxxsdsdsdsdsds
        </span>

        {props.displaysMappings && (
            <div>
                
                <input type="text" value={mapping} onChange={(event) => {
                    handleMappingChange(event);
                }} />
                <button>
                    Remove this mapping
                </button>
            </div>
            )}
        
    </div>
);
}

export type LogTableProps = {
    displaysMappings: boolean | undefined;
    events: string[];
}
  

export default LogTable;
