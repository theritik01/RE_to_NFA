$(document).ready(function () {
  // VARIABLE DECLARATION
  // Variable Set Of State NFA
  var setOfStateN = [];
  // variable Set Of Symbol NFA
  var setOfSymbolN = [];
  // Variable Set of Final State NFA
  var setOfFinalN = [];
  // Variable Initial State NFA
  var initialStateN = '';
  // Trantition Function NFA
  var trantitionFunctionN = {};
  // VARIABLE DECLARATION END

  $('#submitSearch').click(function () {
    var t0 = performance.now();
    setGenerateNFA();
    printQuintupleNFA(setOfStateN, setOfSymbolN, initialStateN, setOfFinalN, trantitionFunctionN);
    printResultDocument(checkDocument());
    var t1 = performance.now();
    printTimeConsumed(t1 - t0);
  });

  function getDataFromDoc(numberDoc) {
    let link = ''.concat('/js/module1/documents/doc', numberDoc, '.txt');
    var doc = {
      data: '',
      number: numberDoc,
    };

    $.ajax(link, {
      async: false,
      success: function (data) {
        doc.data = data;
      },
      error: function (xhr) {
        console.log('Error : File ' + link + '\nStatus : ' + xhr.status + ' ' + xhr.statusText);
      },
    });
    return doc;
  }

  // FUNCTION USER INPUT
  function getUserInput() {
    let input = $('#inputSearch').val();
    return input;
  }

  // FUNCTION GENERATE QUINTUPLE NFA
  function setGenerateNFA() {
    // VARIABLE DECLARATION
    // variable input user
    let inputUser = '';
    // Variable bantuan untuk input state
    let state = 0;
    // Variable bantuan untuk menampung state terkini
    let tempState = '';
    // VARIABLE DECLARATION END
    // RESET VARIABLE
    setOfStateN = [];
    // variable Set Of Symbol NFA
    setOfSymbolN = [];
    // Variable Set of Final State NFA
    setOfFinalN = [];
    // Variable Initial State NFA
    initialStateN = '';
    // Trantition Function NFA
    trantitionFunctionN = {};
    // Split input user jadi array berdasarkan spasi -> input user = [input,user]
    inputUser = getUserInput().split(' ');
    // Memasukkan initial state NFA ke initial state dan set of state
    tempState = 'q' + state;
    initialStateN = tempState;
    setOfStateN.push(tempState);

    $.each(inputUser, function (i) {
      // Split setiap array dari user, menjadi array lagi -> input = [i,n,p,u,t]
      let inputUser2 = inputUser[i].split('');
      $.each(inputUser2, function (index, value) {
        // totalState = (inputUser2.length+1);
        tempPrevState = tempState;
        state++;
        tempState = 'q' + state;
        if (index == 0) {
          setObject(trantitionFunctionN, initialStateN + '.' + value, tempState);
        } else {
          setObject(trantitionFunctionN, tempPrevState + '.' + value, tempState);
        }
        // Memasukkan state awal ke set of state
        setOfStateN.push(tempState);
        // Memasukkan setiap symbol ke set of symbol
        if (!setOfSymbolN.includes(value)) {
          setOfSymbolN.push(value);
        }
      });
      // Menambahkan set of final state berdasarkan posisi state terakhir di inscrement state
      setOfFinalN.push(tempState);
    });
  }

  // FUNCTION DISPLAY QUINTUPLE OF NFA
  function printQuintupleNFA(a, b, c, d, e) {
    $('#quintupleNFA').html(
      '<h6>Generated NFA (Quintuple) from user input :</h6><p>Set of state : {' +
        a +
        '}</p><p>Set of symbol : {' +
        b +
        '}</p><p>Initial State : ' +
        c +
        '</p><p>Set of final state : {' +
        d +
        '}</p><p>Trantition Function : </p>'
    );
    for (let key in e) {
      for (let keys in e[key]) {
        $('#quintupleNFA').append(
          '<p><pre>     Delta(' + key + ',' + keys + ') = ' + e[key][keys] + '</pre></p>'
        );
      }
    }
  }

  function checkDocument() {
    var searchResult = [];
    let awalDoc = $('#awal').val();
    let akhirDoc = $('#akhir').val();
    for (let i = awalDoc; i <= akhirDoc; i++) {
      let dataTemp = getDataFromDoc(i).data.split(' ');
      console.log(dataTemp)
      for (let j = 0; j < dataTemp.length; j++) {
        let wordTemp = dataTemp[j].split('');
        // console.log('debug 1 : '+wordTemp);
        // current State
        var curState = 'q0';
        let key = {};
        loop1: for (let k = 0; k < wordTemp.length; k++) {
          key = trantitionFunctionN[curState];
          for (let keys in key) {
            if (keys == wordTemp[k]) {
              curState = trantitionFunctionN[curState][keys];
            } else {
              break loop1;
            }
          }
        }
        console.log(setOfFinalN)
        if (setOfFinalN.includes(curState)) {
          
          searchResult.push(i);
        }
      }
    }
    
    return searchResult;
  }

  function printResultDocument(arrayNum) {
    $('#resultDoc').html('<h6>Search result : </h6>');
    let arrayNum2 = Array.from(new Set(arrayNum));
    for (let i = 0; i < arrayNum2.length; i++) {
      let p = getSnippet(arrayNum2[i]);
      $('#resultDoc').append(
        '<a href="assets/documents/doc' +
          arrayNum2[i] +
          '.txt" target="_blank">doc' +
          arrayNum2[i] +
          '.txt</a>' +
          '<p>' +
          p +
          '</p>'
      );
    }
  }

  function getSnippet(i) {
    snippet = getDataFromDoc(i)['data'];
    return snippet.substr(0, 200);
  }

  // DISPLAY TIME CONSUMED
  function printTimeConsumed(time) {
    $('#resultDoc').append('<h6>Time Consumed : ' + time + ' ms </h6>');
  }

  function setObject(obj, path, value) {
    let schema = obj;
    let pList = path.split('.');
    let len = pList.length;
    for (let i = 0; i < len - 1; i++) {
      let elem = pList[i];
      if (!schema[elem]) schema[elem] = {};
      schema = schema[elem];
    }
    schema[pList[len - 1]] = value;
  }
});
