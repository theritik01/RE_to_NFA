import Enfa from "./Enfa.js";
import Stack from "./Stack.js";
import { checkKeyword, infix_to_postfix, modify_regex } from "./Utils.js";
console.log("I AM IN");
const solve_for_nfa = (regex) => {
  var st = new Stack();

  //Traverse in Postfix regular expression and convert it into NFA

  //      Steps for conversion is:
  // ************************************
  // ************************************
  // 1. If you get a character, create a NFA for the single character and push the NFA to the stack.
  // 2. If you get a keyword (any one from * | . +):
  //  2.a. If the keyword is '*':
  //      2.a.i.  if the stack is empty, return failed conversion(-1)
  //      2.a.ii. else pop the top from stack, apply Klene closure and push back to stack
  //  2.b. If the keyword is '+':
  //      2.b.i.  if the stack is empty, return failed conversion(-1)
  //      2.b.ii. else pop the top from stack, apply Klene plus and push back to stack
  //  2.c. If keyword is '.':
  //      2.c.i   if the stack has less than 2 elements, return failed conversion(-1)
  //      2.c.ii. else pop two elements apply concatenation and push the result in stack.
  //  2.d. If keyword is '|':
  //      2.d.i   if the stack has less than 2 elements, return failed conversion(-1)
  //      2.e.ii. else pop two elements apply NFA(1)|NFA(2) and push the result in stack.
  // 3. Check the stack, if it contains exactly 1 element, return it as result, else failed conversion.
  // ************************************

  for (let i = 0; i < regex.length; i++) {
    if (checkKeyword(regex[i])) {
      if (regex[i] == "*") {
        if (st.isempty()) return -1;

        var cur = st.pop();
        cur = cur.klene_closure();
        st.push(cur);
      } else if (regex[i] == "+") {
        if (st.isempty()) return -1;

        var cur = st.pop();
        cur = cur.klene_plus();
        st.push(cur);
      } else if (regex[i] == "|") {
        if (st.isempty()) return -1;
        var c1 = st.pop();
        if (st.isempty()) return -1;
        var c2 = st.pop();

        c2 = c2.addition(c1);
        st.push(c2);
      } else if (regex[i] == ".") {
        if (st.isempty()) return -1;
        var c2 = st.pop();
        if (st.isempty()) return -1;
        var c1 = st.pop();

        c1 = c1.concat(c2);
        st.push(c1);
      } else return -1;
    } else {
      var n = new Enfa(regex[i]);
      st.push(n);
    }
  }

  var res = st.pop();
  if (!st.isempty()) return -1;
  return res;
};

//Create a wrapper function for  conversion from REGEX to NFA
const regex_to_nfa = (regex) => {
  //Modify regex for irregularities(it doesn't completely check for irregularities as it is out of scope of this project)
  regex = modify_regex(regex);

  //Convert the Infix regular expression to postfix regular expression
  regex = infix_to_postfix(regex);

  // Solve postfix regex to get resultant NFA
  return solve_for_nfa(regex);
};

//Function to print resultant NFA in html body
const print_nfa = (nfa) => {
  console.log(nfa);

  document.querySelector("#nfa_transitions").innerHTML = "";

  var states_arr = nfa.states.toString();
  document.querySelector("#nfa_states").innerHTML = states_arr;

  states_arr = nfa.inputs.toString();
  document.querySelector("#nfa_inputs").innerHTML = states_arr;

  states_arr = nfa.intial_state;
  document.querySelector("#nfa_initial_state").innerHTML = states_arr;

  states_arr = nfa.final_states.toString();
  document.querySelector("#nfa_final_states").innerHTML = states_arr;

  var transition_table = document.querySelector("#nfa_transitions");
  var thead = document.createElement("thead");
  states_arr = document.createElement("th");
  states_arr.innerHTML = "STATES";
  thead.appendChild(states_arr);

  nfa.inputs.forEach((e) => {
    var inp = document.createElement("th");
    inp.innerHTML = e;
    thead.appendChild(inp);
  });

  transition_table.appendChild(thead);

  nfa.states.forEach((from) => {
    var row = document.createElement("tr");
    states_arr = document.createElement("td");

    states_arr.innerHTML = from;
    row.appendChild(states_arr);

    row.appendChild(states_arr);

    nfa.inputs.forEach((via) => {
      states_arr = document.createElement("td");
      if (
        nfa.transition[from] == undefined ||
        nfa.transition[from][via] == undefined
      )
        states_arr.innerHTML = "-----";
      else states_arr.innerHTML = nfa.transition[from][via];

      row.appendChild(states_arr);
    });

    transition_table.appendChild(row);
  });
};

// Event listener for onClick event of submit button, which converts given regex to NFA then to DFA and then prints both NFA anf DFA to the HTML body
document.querySelector("#convert").addEventListener("click", () => {
  document.querySelector("#nfa").style.display = "none";

  var regex = document.querySelector("#regex-input").value;

  regex = modify_regex(regex);
  document.querySelector("#mod_regex").textContent = regex;

  var nfa = regex_to_nfa(regex);
  if (nfa == -1)
    alert(
      "NFA not possible for given Regular expression. Please check the regular expression you have entered."
    );
  else {
    print_nfa(nfa);
    document.querySelector("#nfa").style.display = "block";
  }
});
