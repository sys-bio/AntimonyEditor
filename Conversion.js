// Keep the require for local testing using node path/to/Conversion.js or can use npm start
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

/**
 * @description Load LibAntimonyJs and use the library's functions to convert Antimony to SBML
 */
function processAntimony() {
  // Grab antimonyString global variable from AntimonyEditor to get ant model string
  let antimonyString = window.antimonyString;
  try {
    libantimony().then((libantimony) => {
      // Load LibAntimonyJs
      // Format: libantimony.cwrap( function name, return type, input param array of types).
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

      // Load Antimony string to the library
      var ptrAntCode = jsAllocateUTF8(antimonyString);
      var load_int = loadAntimonyString(antimonyString);

      // If Antimony string has no errors, grab sbml string and save to sbmlString global variable.
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

// Save processAntimony function as global function to be used in AntimonyEditor. THIS IS IMPORTANT DO NOT REMOVE.
window.processAntimony = processAntimony;