
// For use in nodejs environment.
// Test Antimony javascript library 
const libantimony = require('../../public/libantimony.js'); // libantimony.js in local dir

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
	testCase = "Test 1: Testing processAntimony()"
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