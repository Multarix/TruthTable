import chalk from "chalk";

interface IVariables {
	[key: string]: boolean;
}

function createExpression(expression: string, variables: string[]): string {
	let finalExpression = expression;
	for(const vari of variables){
		// eslint-disable-next-line no-useless-escape
		const variableRegex = new RegExp(`(^|[^a-zA-Z])${vari}([^a-zA-Z]|$)`, "m");

		let matches = variableRegex.exec(expression);
		while(matches){
			const match = matches[0];
			const matchStart = matches[1];
			const matchEnding = matches[2];

			expression = expression.replace(match, "");
			finalExpression = finalExpression.replace(match, `${matchStart}this._variables["${vari}"]${matchEnding}`);

			matches = variableRegex.exec(expression);
		}
	}

	return finalExpression;
}


/** A class that generates a truth table for a given expression and variables. */
export default class TruthTable {

	/** The expression used to generate the truth table. */
	private _expression: string = "";

	/** An object containing the variables used in the expression and their corresponding boolean values. */
	private _variables: IVariables = {};

	/** The truth table generated from the expression and variables. */
	private _table: string = "";

	/** Creates a new instance of the TruthTable class.
	 * @param expression The expression used to generate the truth table.
	 * @param variables An array of variables used in the expression.
	 */
	constructor(expression: string, variables: string[]) {
		this.expression = expression;
		this.variables = variables;
	}

	/** The current expression used to generate the truth table. */
	public get expression(): string {
		return this._expression;
	}

	public set expression(expression: string) {
		this._table = ""; // Clear the current table
		this._expression = expression.replace(/¬/g, "!") // Make sure the expression is in JS format
			.replace(/\u0076/g, "||")
			.replace(/∧/g, "&&")
			.replace(/↔/g, "===");
	}

	/** An array of variables used in the expression.
	 * @privateRemarks Gets the keys from the _this.variables object and returns them as an array.
	 */
	public get variables(): string[] {
		const array = Object.keys(this._variables);
		return array;
	}

	public set variables(variables: string[]) {
		this._table = ""; // Clear the current table

		// Delete all keys from the object
		for(const key of Object.keys(this._variables)){
			delete this._variables[key];
		}

		// Add the variables as keys of the object
		for(const variable of variables){
			this._variables[variable] = false;
		}
	}

	/**
	 * Builds the truth table from scratch.
	 * @returns A string representation of the truth table.
	 */
	private _buildTable(): string {
		const variables = this.variables;
		const jsExpression = this.expression;
		const mathExpression = jsExpression.replace(/!/g, "¬") // Math formatting (Teachers love this shit)
			.replace(/\|\|/g, "\u0076")
			.replace(/&&/g, "∧")
			.replace(/===/g, "↔");

		const expression = createExpression(jsExpression, variables);
		const table: string[] = [];

		const firstLine = `|   ${variables.join("   |   ")}   | ${mathExpression}`;
		const secondLine = "-".repeat(firstLine.length);

		table.push(firstLine, secondLine);

		let lineBinary = "1".repeat(variables.length);
		let lineDecimal = parseInt(lineBinary, 2);

		while(lineDecimal >= 0){
			// Make sure the binary is always the correct length otherwise we'll
			// lose false values on the values at the start the closer we get to 0
			if(variables.length > lineBinary.length) lineBinary = "0".repeat(variables.length - lineBinary.length) + lineBinary;

			const boolArray: boolean[] = [];
			const lineBinaryArray = lineBinary.split("");

			for(const bit of lineBinaryArray) boolArray.push(bit === "1");
			for(let i = 0; i < variables.length; i++){
				this._variables[variables[i]] = boolArray[i];
			}

			const result = !!eval(expression);
			const line = `| ${boolArray.join(" | ")} | -> ${result}`.replace(/true/g, "true ");

			table.push(line);

			lineDecimal -= 1;
			lineBinary = lineDecimal.toString(2);
		}


		return table.join("\n");
	}

	/**
	 * Generates the truth table for the current expression and variables.
	 * @returns A string representation of the truth table.
	 */
	public createTable(): string {
		if(this._table.length > 0) return this._table;
		return this._buildTable();
	}

	/** Logs the table to the console
	 * @param colored Whether or not to color the output with chalk
	*/
	public log(colored: boolean = false): void {
		let table = this.createTable();

		if(colored){
			table = table.replace(/[tT]rue/g, chalk.green("True"))
				.replace(/[fF]alse/g, chalk.red("False"));
		}

		console.log(table);
	}
}

