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
  const event = new CustomEvent('grabbedSBMLResult', { detail: window.sbmlResult });
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
        window.sbmlResult = sbmlResult;
        window.dispatchEvent(event);
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

function processSBML() {
  // Grab antimonyString global variable from AntimonyEditor to get ant model string
  let sbmlString = window.sbmlString;
  const event = new CustomEvent('grabbedAntimonyResult', { detail: window.antimonyString });
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

      sbmlCode = sbmlString;
      clearPreviousLoads();
      var ptrSBMLCode = jsAllocateUTF8(sbmlCode);
      var load_int = loadSBMLString(sbmlCode);

      if (load_int > 0) {
        antResult = getAntimonyString();
        if (window.conversion == "biomodels") {
          citation = (window.citation == null) ? "// No citation provided by PubMed" : "// Citation: " + window.citation;
          antResult = "// Link to the paper: " + window.url + "\n" + "// Link to BioModels: " + window.biomodelsUrl + "\n" +
            "// Title: " + window.title + "\n" + "// Authors: " + window.authors + "\n" + 
            "// Journal: " + window.journal + "\n" + citation + "\n" + "// Date: " + window.date + "\n" + antResult
            window.conversion = "standard";
        }
        window.antimonyResult = antResult;
        window.dispatchEvent(event);
      } else {
        var errStr = getLastError();
        window.alert(errStr);
      }
      jsFree(ptrSBMLCode);
    });
  } catch (err) {
    console.log("Load libantimony error: ", err);
  }
}

/**
 * @description Loads LibAntimonyJs and converts an Antimony model string to SBML.
 *              Unlike `processAntimony`, this function directly returns the converted SBML string
 *              instead of dispatching an event.
 * @param {string} antimonyString - The Antimony string to convert to SBML.
 * @returns {Promise<string>} The converted SBML string, or "" if an error occurs.
 */
async function convertAntimonyToSBML(antimonyString) {
  try {
    const libantimonyInstance = await libantimony();
    const loadAntimonyString = libantimonyInstance.cwrap('loadAntimonyString', 'number', ['string']);
    const getSBMLString = libantimonyInstance.cwrap('getSBMLString', 'string', ['null']);
    const getLastError = libantimonyInstance.cwrap('getLastError', 'string', ['null']);
    const jsAllocateUTF8 = (str) => libantimonyInstance.allocateUTF8(str);
    const jsFree = (ptr) => libantimonyInstance._free(ptr);

    const ptrAntCode = jsAllocateUTF8(antimonyString);
    const loadResult = loadAntimonyString(antimonyString);

    if (loadResult > 0) {
      sbmlResult = getSBMLString();
    } else {
      const errorStr = getLastError();
      window.alert(errorStr);
    }

    jsFree(ptrAntCode);

    return sbmlResult;
  } catch (err) {
    console.error("Load LibAntimonyJs error: ", err);
    return "";
  }
}

/**
 * @description Loads LibAntimonyJs and converts an SBML model string to Antimony.
 *              Unlike `processSBML`, this function directly returns the converted Antimony string
 *              instead of dispatching an event.
 * @param {string} sbmlString - The SBML string to convert to Antimony.
 * @returns {Promise<string>} The converted Antimony string, or "" if an error occurs.
 */
async function convertSBMLToAntimony(sbmlString) {
  try {
    const libantimonyInstance = await libantimony();
    const loadSBMLString = libantimonyInstance.cwrap('loadSBMLString', 'number', ['string']);
    const getAntimonyString = libantimonyInstance.cwrap('getAntimonyString', 'string', ['null']);
    const getLastError = libantimonyInstance.cwrap('getLastError', 'string', ['null']);
    const clearPreviousLoads = libantimonyInstance.cwrap('clearPreviousLoads', 'null', ['null']);
    const jsAllocateUTF8 = (str) => libantimonyInstance.allocateUTF8(str);
    const jsFree = (ptr) => libantimonyInstance._free(ptr);

    clearPreviousLoads();
    const ptrSBMLCode = jsAllocateUTF8(sbmlString);
    const loadResult = loadSBMLString(sbmlString);

    let antimonyResult = "";
    if (loadResult > 0) {
      antimonyResult = getAntimonyString();

      if (window.conversion === "biomodels") {
        const citation = window.citation ? `// Citation: ${window.citation}` : "// No citation provided by PubMed";
        antimonyResult = `// Link to the paper: ${window.url}\n` +
          `// Link to BioModels: ${window.biomodelsUrl}\n` +
          `// Title: ${window.title}\n` +
          `// Authors: ${window.authors}\n` +
          `// Journal: ${window.journal}\n` +
          `${citation}\n` +
          `// Date: ${window.date}\n` +
          antimonyResult;

        window.conversion = "standard";
      }
    } else {
      const errorStr = getLastError();
      window.alert(errorStr);
    }

    jsFree(ptrSBMLCode);
    return antimonyResult;
  } catch (err) {
    console.error("Load LibAntimonyJs error: ", err);
    return "";
  }
}

// Save processAntimony and processSBML function as global function to be used in AntimonyEditor. THIS IS IMPORTANT DO NOT REMOVE.
window.processAntimony = processAntimony;
window.processSBML = processSBML;
window.convertAntimonyToSBML = convertAntimonyToSBML;
window.convertSBMLToAntimony = convertSBMLToAntimony;
