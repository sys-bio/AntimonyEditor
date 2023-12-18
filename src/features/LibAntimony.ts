import libantimony from "../libAntimony/libantimony.js";

var sbmlResult = "None";

var loadAntimonyString: (arg0: string) => any; // libantimony function
var loadString;   // 		"
var loadSBMLString; //		"
var getSBMLString: () => any; //		"
var getAntimonyString; //	"
var getCompSBMLString; //	"
var clearPreviousLoads; //	"
var getLastError: () => any; //		"
var getWarnings;  //		"
var getSBMLInfoMessages; //	"
var getSBMLWarnings; //		"
var freeAll;      //		"
var jsFree: (strPtr: any) => any;         // emscripten function
var jsAllocateUTF8: (arg0: string) => any; //  	

export async function processAntimony(antCode: string) {
  try {
    libantimony().then((libantimony: any) => {
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
  
      jsFree = (strPtr: any) => libantimony._free(strPtr);
      jsAllocateUTF8 = (newStr: any) => libantimony.allocateUTF8(newStr);
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