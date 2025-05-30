
// For use in nodejs environment.
// Test Antimony javascript library 
const libantimony = require('../public/libantimony.js'); // libantimony.js in local dir

console.log('Starting script...');
var antString = "model example1; S1 -> S2; k1*S ; S1 = 550; S2 = 0;  k1 = 0.1; end"
var antCode;
var sbmlCode;
var sbmlResult = 'None';
var antResult = 'None';

var loadAntimonyString; // libantimony function
var loadString;		// 		"
var loadSBMLString;	//		" 
var getSBMLString;	//		"
var getAntimonyString;	//		"
var getCompSBMLString;	//		"
var clearPreviousLoads; //		"
var getLastError;	//		"
var getWarnings;	//		"
var getSBMLInfoMessages;//		"
var getSBMLWarnings;	//		"
var freeAll;		 //		"
var jsAllocateUTF8;  // emscripten function
var jsUTF8ToString;  //     "
var jsFree;          // 	"

// run tests:
runAntimonyCheck();

// Load library functions (asynchronous call):
function loadAntLib(myCallBack) {
 try {
  libantimony().then((libantimony) => {
 //	Format: libantimony.cwrap( function name, return type, input param array of types).
   loadString = libantimony.cwrap('loadString', 'number', ['string']);
   loadAntimonyString = libantimony.cwrap('loadAntimonyString', 'number', ['string']);
   loadSBMLString = libantimony.cwrap('loadSBMLString', 'number', ['string']);
   getSBMLString = libantimony.cwrap('getSBMLString', 'string', ['null']);
   getAntimonyString = libantimony.cwrap('getAntimonyString', 'string', ['null']);
   getCompSBMLString = libantimony.cwrap('getCompSBMLString', 'string', ['string']); 
   clearPreviousLoads = libantimony.cwrap('clearPreviousLoads', 'null', ['null']);
   getLastError = libantimony.cwrap('getLastError', 'string', ['null']);
   getWarnings = libantimony.cwrap('getWarnings', 'string', ['null']);
   getSBMLInfoMessages = libantimony.cwrap('getSBMLInfoMessages', 'string', ['string']);
   getSBMLWarnings = libantimony.cwrap('getSBMLWarnings', 'string', ['string']);
   freeAll = libantimony.cwrap('freeAll', 'null', ['null']);
   jsAllocateUTF8 = (newStr) => libantimony.allocateUTF8(newStr);
   jsUTF8ToString = (strPtr) => libantimony.UTF8ToString(strPtr);
   jsFree = (strPtr) => libantimony._free(strPtr);
   myCallBack();
   
   });
 }
 catch(err) {
  console.log('Load libantimony error: ', err);
 }
}


// Test basic functionality: returns 1 if no errors
function runAntimonyCheck() {
  loadAntLib(runTests);
}

// Callback function that run tests:
function runTests() {
  var pass = 0; //Keep track of number of tests that pass
  var fail = 0;
  var antResult = "nothing";
  var testCase = "Test 1: loadString(ant model)";
  var intResult = loadString(antString); // TEST loadString(ant model)
  if(intResult < 0) {
    console.log(testCase ,': ** Failed ->', getLastError());
	fail++;
  }
  else {
    antResult = getAntimonyString();
    sbmlResult = getSBMLString();
	if( antResult.includes('_J0: S1 -> S2; k1*S;') && sbmlResult.includes('species id="S1" compartment="default_compartment" initialConcentration="550"') ) {
	  console.log(testCase ,': Pass');
	  pass++;
	} else {
	  console.log(testCase ,': ** Failed -> getAntimonyString() or getSBMLString() returned incorrect string');
	  fail++;
	}
	//console.log('Returned Antimony: ', antResult);
    //console.log('Returned SBML' ,sbmlResult);
  }
  
  testCase = "Test 2: loadString(SBML model)";
  clearPreviousLoads();
  intResult = 0;
  intResult = loadString(sbmlResult);
  if(intResult < 0) {
    console.log(testCase ,': ** Failed ->', getLastError());
	fail++;
  }
  else {
    antResult = 'nothing';
    antResult = getAntimonyString();
	if( antResult.includes('_J0: S1 -> S2; k1*S;') ) {
	  console.log(testCase ,': Pass');
	  pass++;
	} else {
	  console.log(testCase ,': ** Failed -> getAntimonyString() returned incorrect string');
	  fail++;
	}
  }
  
  testCase = "Test 3: loadAntimonyString()"; 
  clearPreviousLoads();  
  sbmlResult = 'none';
  intResult = 0;
  intResult = loadAntimonyString(antString);
  if(intResult < 0) {
    console.log(testCase ,': ** Failed ->', getLastError());
	fail++;
  }
  else {
    sbmlResult = getSBMLString();
	if( sbmlResult.includes('species id="S1" compartment="default_compartment" initialConcentration="550"') && intResult == 1 ) {
    console.log(testCase ,': Pass');
	pass++;
	} else {
	  console.log(testCase ,': ** Failed -> Returned SBML model is different');
	  fail++;
	}
  }
  
  testCase = "Test 4: loadSBMLString()";
  clearPreviousLoads();	
  intResult = 0;
  intResult = loadSBMLString(sbmlResult);
  if(intResult < 0) {
    console.log(testCase ,': ** Failed ->', getLastError());
	fail++;
  }
  else {
    antResult = "nothing";
    antResult = getAntimonyString();
	if(antResult.includes('species S1, S2;') && intResult == 1 ) {
	  console.log(testCase ,': Pass');
	  pass++;
	} else {
	  console.log(testCase ,': ** Failed -> Returned Antimony model is different');
	  fail++;
	}
  }
  
  testCase = "Test 5: getLastError()";
  clearPreviousLoads();	
  var errSBMLStr = sbmlResult.replace('id="S1"', 'id="S5"');
  intResult = 0;
  intResult = loadSBMLString(errSBMLStr);
  if( intResult != -1) {
    console.log(testCase ,': ** Failed -> Load bad SBML returned int != -1');
	fail++;
  } else {
    const lastErr = getLastError();
    const sbmlInfo = getSBMLInfoMessages();
    const sbmlWarn = getSBMLWarnings('example1'); //model id = 'example1'
	if( lastErr.includes("line 19: (21111 [Error]) The value of a <speciesReference> 'species' attribute must be the identifier of an existing <species> in the model.") ) {
	  console.log(testCase ,': Pass');
	  pass++;
	} else {
	  console.log(testCase ,': ** Failed -> Wrong error msg returned.');
	  fail++;
	}
    //console.log('getLastError(): ', lastErr); // Expected
    //console.log('getSBMLInfoMessages(): ', sbmlInfo);// none expected
    //console.log('getSBMLWarnings(): ', sbmlWarn); // none expected, 
    }

  // **************************************	
  testCase = "Test 6: getCompSBMLString()";
  const antComposite = "model feedback(); J0: $X0 -> S1; (VM1 * (X0 - S1/Keq1))/(1 + X0 + S1 + S4^h); J1: S1 -> S2; (10 * S1 - 2 * S2) / (1 + S1 + S2); S1 = 0; S2 = 0; S4 = 0; X0 = 10; X1 = 0; Keq1 = 10; VM1 = 10;  h = 10; end; model myModelTwo(); J0: S1 -> S2; (5 * S1 - S2) / (1 + S2); S1 = 5; S2 = 0; end; model compA(); A: feedback(); B: myModelTwo(); A.S1 = 2; JcompA: A.S1 + B.S1 -> B.S2; kcomp*(A.S1 + B.S1); kcomp = 1;end;"
  
  clearPreviousLoads();  
  sbmlResult = 'none';
  intResult = 0;
  intResult = loadAntimonyString(antComposite);
  if(intResult < 0) {
    console.log(testCase ,': ** Failed ->', getLastError());
	fail++;
  }

	testCase = "Test 7: Testing processAntimony()"
  let newSbmlResult = processAntimony(`model example1; S1 -> S2; k1*S ; S1 = 550; S2 = 0;  k1 = 0.1; end`);
  console.log(newSbmlResult)
  if (sbmlResult < 0) {
    console.log(testCase ,': ** Failed ->', getLastError());
    fail++;
  } else {
	  console.log(testCase ,': Pass');
	  pass++;
  }
  
  console.log('Pass-', pass,', Fail-', fail);
  if (fail == 0){ 
    return 1;
  } else { return 0;} // fail
}

// ***************************************
// Functions not used in runTests()
// Use them for browser testing as needed:
// ***************************************
function processAntimony(antStr) {
 clearPreviousLoads();
 sbmlResult = 'nothing';
 //console.log("*** Antimony code: ",antStr);
 var ptrAntCode = jsAllocateUTF8(antStr);
 var load_int = loadAntimonyString(antStr);
 console.log("processAntimony: int returned: ", load_int);
 if (load_int > 0) {
   sbmlResult = getSBMLString();
   jsFree(ptrAntCode)
   return sbmlResult
 }
 else { 
   var errStr = getLastError();
   console.log(errStr); }
  
}

function processSBML(sbmlStr) {
 //sbmlCode = document.getElementById("sbmlcode").value;
 clearPreviousLoads();
 antResult = 'nothing';
 var ptrSBMLCode = jsAllocateUTF8(sbmlStr);
 var load_int= loadSBMLString(ptrSBMLCode);
 console.log("processSBML: int returned: ", load_int);
 if (load_int > 0) {
   antResult = getAntimonyString(); 
 
 }
 else { 
   var errStr = getLastError();
   console.log(errStr); 
   }

 return antResult
}
 async function processFile(fileStr) {
  if(fileStr.length > 1000000){
    console.log('Model file is very large and may take a minute or more to process!');
  }
  try {
	clearPreviousLoads;
    var ptrFileStr = jsAllocateUTF8(fileStr);
    if (loadAntimonyString(ptrFileStr) > 0) {
      processAntimony();
    } else if (loadSBMLString(ptrFileStr) > 0) {
        processSBML();  
    } else {
      var errStr = getLastError();
      console.log(errStr);
      clearPreviousLoads();
      }
  } catch (err) {
    console.log("processing file error: :", err);
    }
  jsFree(ptrFileStr);
}