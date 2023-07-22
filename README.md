# Truth Table
Allows for easy truth table building.<br>
Can also convert some of the dumb math jargon like "¬" meaning "not" or "∧" meaning "and" into javascript readable statements.<br>

Currently supported math jargon:

- `¬` = `!`<br>
- `∨` = `||`<br>
- `∧` = `&&`<br>
- `↔` = `===`<br>

---

# TruthTable class
## Constructor
Takes a string argument as the first expression, and an array of strings as the second argument for the variables.<br>

## Properties
- `expression` - The expression passed into the constructor.
- `variables` - The variables passed into the constructor.

## Methods
### .createTable()
Returns an array of objects containing the truth table.
Takes no arguments.

---

### .log()
Logs the truth table to the console.
- Takes a boolean argument, which determines if the console output will be colored or not. Defaults to `false`.

---

# Example Usage

```js
const expression = "((!a && b) || (c && (!b || !d)) && (!c === b))";
const variables = ["a", "b", "c", "d"];

const truthTable = new TruthTable(expression, variables);

truthTable.log(); // Results in the below being outputt to the console:

/*
|   a   |   b   |   c   |   d   | ((¬a ∧ b) v (c ∧ (¬b v ¬d)) ∧ (¬c ↔ b))
-------------------------------------------------------------------------
| True  | True  | True  | True  | -> False
| True  | True  | True  | False | -> False
| True  | True  | False | True  | -> False
| True  | True  | False | False | -> False
| True  | False | True  | True  | -> True
| True  | False | True  | False | -> True
| True  | False | False | True  | -> False
| True  | False | False | False | -> False
| False | True  | True  | True  | -> True
| False | True  | True  | False | -> True
| False | True  | False | True  | -> True
| False | True  | False | False | -> True
| False | False | True  | True  | -> True
| False | False | True  | False | -> True
| False | False | False | True  | -> False
| False | False | False | False | -> False
*/

```