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

// Load library functions (asynchronous call):

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
    processAntimony(`
  // Created by libAntimony v2.8.0
model *BIOMD0000000003()

  // Compartments and Species:
  compartment cell;
  species C in cell, M in cell, X in cell;

  // Assignment Rules:
  V1 := C*VM1*(C + Kc)^-1;
  V3 := M*VM3;

  // Reactions:
  reaction1:  => C; cell*reaction1_vi;
  reaction2: C => ; C*cell*reaction2_kd;
  reaction3: C => ; C*cell*reaction3_vd*X*(C + reaction3_Kd)^-1;
  reaction4:  => M; cell*(1 + -1*M)*V1*(reaction4_K1 + -1*M + 1)^-1;
  reaction5: M => ; cell*M*reaction5_V2*(reaction5_K2 + M)^-1;
  reaction6:  => X; cell*V3*(1 + -1*X)*(reaction6_K3 + -1*X + 1)^-1;
  reaction7: X => ; cell*reaction7_V4*X*(reaction7_K4 + X)^-1;

  // Species initializations:
  C = 0.01;
  C has substance_per_volume;
  M = 0.01;
  M has substance_per_volume;
  X = 0.01;
  X has substance_per_volume;

  // Compartment initializations:
  cell = 1;
  cell has volume;

  // Variable initializations:
  VM1 = 3;
  Kc = 0.5;
  VM3 = 1;
  reaction1_vi = 0.025;
  reaction2_kd = 0.01;
  reaction3_vd = 0.25;
  reaction3_Kd = 0.02;
  reaction4_K1 = 0.005;
  reaction5_V2 = 1.5;
  reaction5_K2 = 0.005;
  reaction6_K3 = 0.005;
  reaction7_K4 = 0.005;
  reaction7_V4 = 0.5;

  // Other declarations:
  var V1, V3;
  const cell, VM1, Kc, VM3;

  // Unit definitions:
  unit volume = litre;
  unit substance = mole;
  unit substance_per_volume = mole / litre;

  // Display Names:
  C is "Cyclin";
  M is "CDC-2 Kinase";
  X is "Cyclin Protease";
  reaction1 is "creation of cyclin";
  reaction2 is "default degradation of cyclin";
  reaction3 is "cdc2 kinase triggered degration of cyclin";
  reaction4 is "activation of cdc2 kinase";
  reaction5 is "deactivation of cdc2 kinase";
  reaction6 is "activation of cyclin protease";
  reaction7 is "deactivation of cyclin protease";
end
    `);
  });
} catch (err) {
  console.log("Load libantimony error: ", err);
}


function processAntimony(antCode) {
  var ptrAntCode = jsAllocateUTF8(antCode);
  console.log("ptrAntCode: ", ptrAntCode)
  var load_int = loadAntimonyString(antCode);
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

