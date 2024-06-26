import { CustomMap } from "./Types/EventMapping";

export abstract class TREParser {
    public static parseTRE(tre: string, mappings: CustomMap) {
        this.validateGroups(tre);
        this.validateTimeConstraints(tre);
        this.validateNumbers(tre);
        this.validateSpecialChars(tre);
        this.validateSymbolMappings(tre, mappings);

        return tre;
    }

    public static validateGroups(tre: string): void {
        let opened = 0;
        const emptyGroups = tre.match(/\(\)/g);
        if (emptyGroups && emptyGroups.length > 0) {
            throw new Error("Empty groups are not allowed. An open parenthesis should contain symbols inside it when closed e.g. (A) or (A|B)");
        }

        for (const char of tre) {
            if (char === "(") {
                opened++;
            } else if (char === ")") {
                if (opened === 0) {
                    throw new Error("An additional parenthesis is being closed without it having been opened."); // Found closing parenthesis without matching opening parenthesis
                }
                opened--;
            }
        }
        if (opened !== 0) {
            throw new Error("A parenthesis was opened without it being closed.");
        }
    }

    public static validateTimeConstraints(tre: string): void {
        // match time units /(ms|s|m|h|d)?/;
        // match time constraints = /\d+(\.\d+)?/;
        // Regular expression to match and extract time constraints along with their time units
        const regex = /%\((\d+(\.\d+)?)(ms|s|m|h|d)?,(\d+(\.\d+)?)(ms|s|m|h|d)?\)/g;
        const invalidDecimal = /(\d+\.\d+)(ms|,|\))/g;
        let match: RegExpExecArray | null;
        let timeConstraintCount = tre.split("%").length - 1;
        let matchCount = 0;
        
        const invalidDecimals = tre.match(invalidDecimal);
        if (invalidDecimals && invalidDecimals.length > 0) {
            throw new Error("Invalid decimals, decimal number must be followed by a unit greater than milliseconds");
        }

        // Loop through all matches of time constraints in the TRE
        while ((match = regex.exec(tre)) !== null) {
            matchCount++;
            let firstNumber = parseFloat(match[1]);
            const firstTimeUnit = match[3];
            firstNumber = this.convertTimeToms(firstNumber, firstTimeUnit);
            let secondNumber = parseFloat(match[4]);
            const secondTimeUnit = match[6];
            secondNumber = this.convertTimeToms(secondNumber, secondTimeUnit);

            // Check if the first number is greater than or equal to the second number
            if (firstNumber >= secondNumber) {
                throw new Error("First number in time constraint must be smaller than the second number e.g. a%(1ms,1s) or a%(1s,2s) etc.");
            }
        }

        if (matchCount !== timeConstraintCount) {
            throw new Error("Something is wrong in your time constraints. Look after an extra parenthesis or an invalid time unit. A valid time constraint could be a%(1ms,1s)");
        }

        // Regular expression to match time constraints that are not preceded by a mapped symbol
        const symbolBeforeTimeConstraint = /(?<![a-zA-Z]|\)|\*)%\((\d+(\.\d+)?)(ms|s|m|h|d)?,(\d+(\.\d+)?)(ms|s|m|h|d)?\)/g;

        const invalidTimeConstraint = tre.match(symbolBeforeTimeConstraint);
        if (invalidTimeConstraint && invalidTimeConstraint.length > 0) {
            throw new Error("Time constraints must be preceded by a mapped symbol.");
        }
    }

    public static validateNumbers(tre: string): void {
        // Remove all time constraints from tre. This is the only place numbers should be allowed.
        const timeConstraintRegex = /%\((\d+(\.\d+)?)(ms|s|m|h|d)?,(\d+(\.\d+)?)(ms|s|m|h|d)?\)/g;
        const treWithoutTimeConstraints = tre.replace(timeConstraintRegex, "");
        //Check if there are numbers that are not inside time constraints
        const invalidNumbers = treWithoutTimeConstraints.match(/\d+/g);
        if (invalidNumbers && invalidNumbers.length > 0) {
            throw new Error(`Numbers are only allowed inside time constraints.`);
        }
    }

    public static validateSpecialChars(tre: string): void {
        const expressionWithSmallZFollowedByStar = /z\*/g;
        const invalidExpressionWithSmallZFollowedByStar = tre.match(expressionWithSmallZFollowedByStar);
        if (invalidExpressionWithSmallZFollowedByStar && invalidExpressionWithSmallZFollowedByStar.length > 0) {
            throw new Error(`Expression ${invalidExpressionWithSmallZFollowedByStar[0]} is not allowed. "*" cannot be used after z as this is inferred as (a|b|c|....|Z)*.`);
        }
        //$ is allowed as an expression, see terminate character: https://monaa.readthedocs.io/en/latest/TRE/
        const expressionWithoutSymbolBefore = /(?<![a-zA-Z)*+])([+*&|$]+)/g;
        const invalidExpressionBefore = tre.match(expressionWithoutSymbolBefore);
        if (invalidExpressionBefore && invalidExpressionBefore.length > 0) {
            throw new Error(`Expression ${invalidExpressionBefore[0]} must be preceded by a mapped symbol.`);
        }
        const expressionWithoutSymbolAfter = /[|&](?![(a-zA-Z])/g;
        const invalidExpressionAfter = tre.match(expressionWithoutSymbolAfter);
        if (invalidExpressionAfter && invalidExpressionAfter.length > 0) {
            throw new Error(`Expression ${invalidExpressionAfter[0]} must be followed by a mapped symbol.`);
        }
        const expressionWithDoubleQuantifier = /[+*]{2}/g
        const invalidExpressionDoubleQuantifier = tre.match(expressionWithDoubleQuantifier);
        if (invalidExpressionDoubleQuantifier && invalidExpressionDoubleQuantifier.length > 0) {
        throw new Error(`Expression ${invalidExpressionDoubleQuantifier[0]} There can not be two quantifiers (*/+) consecutivly.`);
        }
    }

    public static validateSymbolMappings(tre: string, mappings: CustomMap): void {
        // Remove all time constraints from the TRE. We do not wish for these to be mapped
        const regex = /%\((\d+(\.\d+)?)(ms|s|m|h|d)?,(\d+(\.\d+)?)(ms|s|m|h|d)?\)/g;
        const treNoTimeConstraints = tre.replace(regex, "");

        // Extract all symbols from the TRE
        const symbols = treNoTimeConstraints.match(/[a-zA-Z]/g)?.filter((symbol) => symbol !== "");
        if (!symbols) {
            return;
        }

        for (const symbol of symbols) {
            // Skip special symbols
            if (
                symbol === "z" ||
                symbol === "Z" ||
                symbol === "|" ||
                symbol === "+" ||
                symbol === "*" ||
                symbol === "&"
            ) {
                continue;
            }
            if (!Array.from(mappings.values()).includes(symbol)) {
                throw new Error(`Symbol '${symbol}' does not have an event mapped to it.`);
            }
        }
    }

    public static convertTimeToms(timeConstraint: number, timeUnit: string): number {
        switch (timeUnit) {
            case "s":
                return timeConstraint * 1000;
            case "m":
                return timeConstraint * 60000;
            case "h":
                return timeConstraint * 3600000;
            case "d":
                return timeConstraint * 86400000;
            default:
                return timeConstraint;
        }
    }
}
