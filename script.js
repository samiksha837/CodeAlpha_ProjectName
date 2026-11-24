
const current = document.getElementById("current");
const previous = document.getElementById("previous");
const buttons = document.querySelector(".buttons");

let expression = "";

function formatResult(number) {
    if (!Number.isFinite(number)) return "Error";

    return String(Number(number.toPrecision(12)));
}

// Calculate expression with operator precedence
function calculate(exp) {
    const tokens = exp.match(
        /(?:\d+\.?\d*|\.\d+)|[+\-*/]/g
    );

    if (!tokens || tokens.join("") !== exp) {
        throw new Error("Invalid expression");
    }

    let index = 0;

    function factor() {
        if (tokens[index] === "-") {
            index++;
            return -factor();
        }

        if (tokens[index] === "+") {
            index++;
            return factor();
        }

        const value = Number(tokens[index++]);

        if (!Number.isFinite(value)) {
            throw new Error("Invalid number");
        }

        return value;
    }

    function term() {
        let result = factor();

        while (tokens[index] === "*" || tokens[index] === "/") {
            const operator = tokens[index++];
            const next = factor();

            if (operator === "*") {
                result *= next;
            } else {
                if (next === 0) throw new Error("Cannot divide by zero");
                result /= next;
            }
        }

        return result;
    }

    function sum() {
        let result = term();

        while (tokens[index] === "+" || tokens[index] === "-") {
            const operator = tokens[index++];
            const next = term();

            result = operator === "+"
                ? result + next
                : result - next;
        }

        return result;
    }

    const answer = sum();

    if (index !== tokens.length || !Number.isFinite(answer)) {
        throw new Error("Invalid expression");
    }

    return answer;
}

function updateDisplay() {
    current.textContent = expression || "0";

    try {
        if (expression && /[\d.]$/.test(expression)) {
            const result = calculate(expression);
            previous.textContent = "= " + formatResult(result);
        } else {
            previous.textContent = "";
        }
    } catch {
        previous.textContent = "";
    }
}

function addValue(value) {
    const operators = ["+", "-", "*", "/"];
    const last = expression.slice(-1);

    if (value === ".") {
        const lastNumber = expression.split(/[+\-*/]/).pop();

        if (lastNumber.includes(".")) return;

        if (lastNumber === "") {
            expression += "0";
        }
    }

    if (operators.includes(value)) {
        if (!expression && value !== "-") return;

        if (operators.includes(last)) {
            expression = expression.slice(0, -1);
        }
    }

    expression += value;
    updateDisplay();
}

function clearCalculator() {
    expression = "";
    updateDisplay();
}

function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

function showResult() {
    if (!expression) return;

    try {
        const answer = calculate(expression);
        previous.textContent = expression + " =";
        expression = formatResult(answer);
        current.textContent = expression;
    } catch {
        current.textContent = "Error";
        previous.textContent = "";
        expression = "";
    }
}

// Button click events
buttons.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) return;

    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === "clear") {
        clearCalculator();
    } else if (action === "delete") {
        deleteLast();
    } else if (action === "calculate") {
        showResult();
    } else if (value !== undefined) {
        addValue(value);
    }
});

// Keyboard support
document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (/^[0-9.]$/.test(key)) {
        addValue(key);
    } else if (["+", "-", "*", "/"].includes(key)) {
        addValue(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        showResult();
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key === "Escape") {
        clearCalculator();
    }
});

updateDisplay();
