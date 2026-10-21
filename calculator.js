// Beginner calculator using arrays, functions, events and DOM updates.
document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("calc-display");
  const expression = document.getElementById("calc-expression");
  const message = document.getElementById("calc-message");
  const buttons = document.querySelectorAll(".real-calc-grid button");
  if (!display || !expression) return;
  let current = "0", stored = null, operator = null, waitingForNext = false;
  const update = () => { display.textContent = current; expression.textContent = stored !== null && operator ? `${stored} ${operator} ${waitingForNext ? "" : current}` : "READY"; };
  const clean = n => Number.isFinite(n) ? String(Number(n.toPrecision(10))) : "Error";
  const calculate = (a, b, op) => {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    if (op === "/") return b === 0 ? NaN : a / b;
    return b;
  };
  const inputDigit = digit => { if (waitingForNext) { current = digit; waitingForNext = false; } else current = current === "0" ? digit : current.length < 14 ? current + digit : current; message.textContent = ""; update(); };
  const chooseOperator = nextOp => { const value = Number(current); if (operator && !waitingForNext && stored !== null) { const result = calculate(stored, value, operator); current = clean(result); stored = result; } else stored = value; operator = nextOp; waitingForNext = true; update(); };
  const act = action => {
    message.textContent = "";
    if (action === "clear") { current = "0"; stored = null; operator = null; waitingForNext = false; }
    else if (action === "decimal") { if (waitingForNext) { current = "0."; waitingForNext = false; } else if (!current.includes(".")) current += "."; }
    else if (action === "sign") current = String(Number(current) * -1);
    else if (action === "percent") current = String(Number(current) / 100);
    else if (action === "backspace") current = current.length > 1 ? current.slice(0, -1) : "0";
    else if (action === "equals" && operator && stored !== null) {
      const result = calculate(stored, Number(current), operator);
      if (!Number.isFinite(result)) { current = "0"; message.textContent = "Cannot divide by zero."; }
      else current = clean(result);
      stored = null; operator = null; waitingForNext = true;
    }
    update();
  };
  buttons.forEach(button => button.addEventListener("click", () => {
    if (button.dataset.digit !== undefined) inputDigit(button.dataset.digit);
    else if (button.dataset.op) chooseOperator(button.dataset.op);
    else act(button.dataset.action);
  }));
  update();
});
