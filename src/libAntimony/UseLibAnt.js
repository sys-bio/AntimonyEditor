var sbmlResult = "None";

export var loadAntimonyString; // libantimony function
export var loadString;   // 		"
export var loadSBMLString; //		"
export var getSBMLString; //		"
export var getAntimonyString; //	"
export var getCompSBMLString; //	"
export var clearPreviousLoads; //	"
export var getLastError; //		"
export var getWarnings;  //		"
export var getSBMLInfoMessages; //	"
export var getSBMLWarnings; //		"
export var freeAll;      //		"
export var jsFree;         // emscripten function
export var jsAllocateUTF8; //  	

export async function processAntimony(antCode) {
  try {
    libantimony().then((libantimony) => {
      //	Format: libantimony.cwrap( function name, return type, input param array of types).
      loadString = libantimony.cwrap("loadString", "number", ["number"]);
      loadAntimonyString = libantimony.cwrap("loadAntimonyString", "number", [
        "number",
      ]);
      loadSBMLString = libantimony.cwrap("loadSBMLString", "number", [
        "number",
      ]);
      getSBMLString = libantimony.cwrap("getSBMLString", "string", ["null"]);
      getAntimonyString = libantimony.cwrap("getAntimonyString", "string", [
        "null",
      ]);
      getCompSBMLString = libantimony.cwrap("getCompSBMLString", "string", [
        "string",
      ]);
      clearPreviousLoads = libantimony.cwrap("clearPreviousLoads", "null", [
        "null",
      ]);
      getLastError = libantimony.cwrap("getLastError", "string", ["null"]);
      getWarnings = libantimony.cwrap("getWarnings", "string", ["null"]);
      getSBMLInfoMessages = libantimony.cwrap("getSBMLInfoMessages", "string", [
        "string",
      ]);
      getSBMLWarnings = libantimony.cwrap("getSBMLWarnings", "string", [
        "string",
      ]);
      freeAll = libantimony.cwrap("freeAll", "null", ["null"]);
  
      jsFree = (strPtr) => libantimony._free(strPtr);
      jsAllocateUTF8 = (newStr) => libantimony.allocateUTF8(newStr);
    });
  } catch (err) {
    console.log("Load libantimony error: ", err);
  }
  var ptrAntCode = jsAllocateUTF8(antCode);
  console.log("ptrAntCode: ", ptrAntCode)
  var load_int = loadAntimonyString(ptrAntCode);
  console.log("load_int: ", load_int)
  if (load_int > 0) {
    sbmlResult = getSBMLString();
    console.log("sbmlResult: ", sbmlResult)
  } else {
    var errStr = getLastError();
    window.alert(errStr);
  }
  jsFree(ptrAntCode);
}