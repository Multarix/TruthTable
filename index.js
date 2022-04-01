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

	const jsFunc = statement.replace(/¬/g, "!").replace(/∨/g, "||").replace(/∧/g, "&&").replace(/↔/g, "==="); // Bunch of replacements in case the inputted string with too mathy
	const dumbStatement = jsFunc.replace(/!/g, "¬").replace(/\|\|/g, "∨").replace(/&&/g, "∧").replace(/===/g, "↔"); // Then we make another bunch of replacements to be used within the column header

	const output = [];
	const firstLine = `|   ${allVars.join("   |   ")}   | ${dumbStatement}`;
	let secondLine = "";
	while(firstLine.length > secondLine.length){
		secondLine += "-";
	}
	output.push(firstLine, secondLine);

	let currentLineBinary = binaryMaker(allVars); // Using binary and counting down to 0 means no 2 truth table lines will ever be the exact same true/ false statements as another
	let currentLineDecimal = parseInt(currentLineBinary, 2); // And the decimal form so it's easy to subtract 1 every loop

	while(currentLineDecimal >= 0){
		// We have to keep the binary the same bit length otherwise if we don't, we'll lose false values on the values at the start the closer we get to 0
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

		// This is so that true and false always take up the same amount of characters - Makes for a cleaner looking output
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

		if(colors) line = line.replace(/false/g, colors.red(false)).replace(/true/g, colors.green(true)); // If you have colors and you want some flair in your console
		output.push(line);

		currentLineDecimal -= 1;
		currentLineBinary = currentLineDecimal.toString(2);
	}
	console.log(output.join("\n"));
};
