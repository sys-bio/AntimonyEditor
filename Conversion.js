// libantimony = require('./libantimony.js');

var sbmlResult = "None";

var loadAntimonyString; // libantimony function
var loadString;   // 		"
var loadSBMLString; //		"
var getSBMLString; //		"
var getAntimonyString; //	"
var getCompSBMLString; //	"
var clearPreviousLoads; //	"
var getLastError; //		"
var getWarnings;  //		"
var getSBMLInfoMessages; //	"
var getSBMLWarnings; //		"
var freeAll;      //		"
var jsFree;         // emscripten function
var jsAllocateUTF8; //

function processAntimony() {
  let antimonyString = window.antimonyString;
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
      var ptrAntCode = jsAllocateUTF8(antimonyString);
      var load_int = loadAntimonyString(antimonyString);
      if (load_int > 0) {
        sbmlResult = getSBMLString();
        window.sbmlString = sbmlResult;
        const event = new CustomEvent('grabbedSBMLResult', { detail: window.sbmlString });
        window.dispatchEvent(event);
        console.log(window.sbmlString);
      } else {
        var errStr = getLastError();
        window.alert(errStr);
      }
      jsFree(ptrAntCode);
    });
  } catch (err) {
    console.log("Load libantimony error: ", err);
  }
}

window.processAntimony = processAntimony;