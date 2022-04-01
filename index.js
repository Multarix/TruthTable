/**
 * Turns all of the items within "vari" into a variable, using the values of "val" as the value, then evaluates the given statement
 * @argument {string[]} vari - An array of strings that will become variable names
 * @argument {string[]} val - Typically an array of booleans that are assigned to their respective variable names
 * @argument {string} statement - A statement of some sort that is evaluated
 * @returns {string} - The result of the evaluated statement
 **/
function getOutput(vari, val, statement){
	for(let i = 0; vari.length > i; i++){
		eval(`this.${vari[i]} = ${val[i]}`); // Set vari[i] = val[i] within the function so they can be referenced easily.
	}

	const output = eval(statement); // Evaluate the statement, eval is dangerous.
	return output.toString();
}

/**
 * Checks the length of the array and increases the binary number accordingly.
 * @argument {string[]} array The array to check the length of.
 * @returns {string} - A binary object

 **/
const binaryMaker = (array) => {
	let binary = "";
	while(array.length > binary.length){
		binary += "1";
	}
	return binary;
};

/**
 * @argument {string} statement - A statement that will be evaluted against various true or false arguments
 * @argument {...string} variables - The names of the various values that will be tested against within the statement
 * @returns {string} - A truth table
 **/
const truthTableMaker = (statement, ...variables) => {
	const allVars = [...variables];

	const jsFunc = statement.replace(/¬/g, "!").replace(/∨/g, "||").replace(/∧/g, "&&").replace(/↔/g, "===");
	const dumbStatement = jsFunc.replace(/!/g, "¬").replace(/\|\|/g, "∨").replace(/&&/g, "∧").replace(/===/g, "↔");

	const output = [];
	const firstLine = `|   ${allVars.join("   |   ")}   | ${dumbStatement}`;
	let secondLine = "";
	while(firstLine.length > secondLine.length){
		secondLine += "-";
	}
	output.push(firstLine, secondLine);

	let currentLineBinary = binaryMaker(allVars);
	let currentLineDecimal = parseInt(currentLineBinary, 2);

	while(currentLineDecimal >= 0){
		while(allVars.length > currentLineBinary.length){
			currentLineBinary = "0" + currentLineBinary;
		}

		const tralse = [];
		const splitBin = currentLineBinary.split("");
		for(const bit of splitBin){
			if(bit === "0"){
				tralse.push(false);
			} else {
				tralse.push(true);
			}
		}

		const tralseString = [];
		for(const tf of tralse){
			if(tf){
				tralseString.push("true ");
			} else {
				tralseString.push("false");
			}
		}

		const functionOutput = getOutput(allVars, tralse, jsFunc);

		let line = tralseString.join(" | ");
		line = `| ${line} | -> ${functionOutput}`;

		output.push(line.replace(/false/g, colors.red(false)).replace(/true/g, colors.green(true)));
		currentLineDecimal -= 1;
		currentLineBinary = currentLineDecimal.toString(2);
	}
	console.log(output.join("\n"));
};


truthTableMaker("(!a && b) || (a && !b)", "a", "b");
