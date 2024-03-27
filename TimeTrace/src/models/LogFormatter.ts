import { getFileLines } from "./helpers/getFileLines";

export class LogFormatter {
    
    async formatLog(originalLog: File, mappings: Map<string, string>): Promise<File> {
        try {
            let lines: string[] = await getFileLines(originalLog); //convert file to array of strings. Has format <time> <event>
            let mappedLines: string[] = this.convertLines(lines, mappings) //map all events and format to <event> <time>
            let f: File = new File([mappedLines.join("\n")], "mapped.txt", {type: "text/plain"}) //return file object with mapped and formatted events
            return f;
        } catch (error) { //readfile might throw error
            throw new Error("Error formatting the log."+ error);
        } 
    }

    convertLines(lines: string[], mappings: Map<string, string>): string[] {
        let mappedRows: string[] = [];
        let mappedValue: string;
        lines.forEach(line => {
            let lineElements: string[] = line.split(" ")
            if (lineElements.length >= 2) { //only map rows that has two elements (ignore newlines at bottom etc)
                let timestamp: string = lineElements.shift() || ""; 
                let event: string = lineElements.join(" ");
                mappedValue = this.getMappedValue(event, mappings)
                mappedRows.push(mappedValue+ " " + this.convertDateformat(timestamp.replace(" ", ""))) //format data <mapped_event> <timestamp>
            }
        });
        return mappedRows;
    }

    getMappedValue(event: string, mappings: Map<string, string>): string {
        event = event.replace(/(\r\n|\n|\r)/gm, "") //remove carriage returns
        let mappedValue: string = "Z" //Mapped value is always Z if not found in mappings
        const foundMapValue = mappings.get(event)
        if (foundMapValue !== undefined && foundMapValue !== "") {  
            mappedValue = foundMapValue;
        }
        return mappedValue
    }

    convertDateformat(timestamp: string): string {
        let miliseconds: number = Date.parse(timestamp)
        return miliseconds.toString()
    }
}