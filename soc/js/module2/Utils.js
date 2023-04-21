import Stack from "./Stack.js";

const prec = (ch) => {
  if (ch == "*" || ch == "+") return 4;
  if (ch == ".") return 3;
  if (ch == "|") return 2;
  return 1;
};

export const checkKeyword = (ch) => {
  if (
    ch == "(" ||
    ch == ")" ||
    ch == "*" ||
    ch == "+" ||
    ch == "." ||
    ch == "|"
  )
    return true;

  return false;
};

// Convert infix reex to postfix regex
export const infix_to_postfix = (regex) => {
  var st = new Stack();
  var out = "";
  for (let i = 0; i < regex.length; i++) {
    if (regex[i] == "(") st.push("(");
    else if (regex[i] == ")") {
      while (!st.isempty() && st.top != "(") {
        out += st.pop();
      }

      if (st.isempty()) return -1;

      st.pop();
    } else if (checkKeyword(regex[i])) {
      while (!st.isempty() && prec(regex[i]) <= prec(st.top)) {
        out += st.pop();
      }
      if (st.isempty()) return -1;
      st.push(regex[i]);
    } else out += regex[i];
  }
  return out;
};

// Modify regex for irregularities (the modification doesn't check for all irregularities)
export const modify_regex = (regex) => {
  regex = "(" + regex + ")";

  for (let i = 0; i < regex.length - 1; i++) {
    if (!checkKeyword(regex[i]) && !checkKeyword(regex[i + 1]))
      regex = regex.substring(0, i + 1) + "." + regex.substring(i + 1);
  }

  return regex;
};
