import * as math from 'mathjs'

const CANDIDATES = "candidates";
const CHEBI = "chebi";
const OBO_CHEBI = "obo.chebi";
const EC = "ec-code";
const EC_HEADER = "EC:";
const KEGG_HEADER = "KEGG:";
const GO = "go";
const RHEA = "rhea";
const RHEA_HEADER = "RHEA:";
const KEGG_REACTION = "kegg.reaction";
const MATCH_SCORE = "match_score";
const NAME_USED = "name_used";
const FORMULA = "formula";
const QUERY_DF = "query_df";
const RECALL = "recall";
const PRECISION = "precision";

// # of digits to be rounded up
const ROUND_DIGITS = 3;

// Tolerance to determine identical numerical values
const TOLERANCE = 0.00001;

// For resulting "DataFrame"
const DF_MATCH_SCORE_COL = "matchScore";
const DF_UPDATE_ANNOTATION_COL = 'updateAnnotation';

// Default URLs for CHEBI/Rhea
const CHEBI_DEFAULT_URL = 'https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI%3A'
const RHEA_DEFAULT_URL = 'https://www.rhea-db.org/rhea/'

async function loadJSON(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching or assigning JSON from ${filePath}:`, error);
  }
}

const REF_RHEA2MASTER = await loadJSON("/public/files/rhea_all2master_jan2025.json");
const REF_KEGG2RHEA = await loadJSON("/public/files/kegg2mrhea_jan2025.json");
const REF_EC2RHEA = await loadJSON("/public/files/ec2mrhea_jan2025.json");
const REF_CHEBI2FORMULA = await loadJSON("/public/files/chebi_shortened_formula_jan2025.json");
const REF_CHEBI2LABEL = await loadJSON("/public/files/chebi2label_jan2025.json");

const REF_RHEA2LABEL = await loadJSON("/public/files/rhea2label_jan2025.json");
const REF_RHEA2ECKEGG = await loadJSON("/public/files/mrhea2eckegg_jan2025.json");

// Used in species_annotation.js
const charcount_np_part1 = await loadJSON("/public/files/charcount_scaled_part1_np_jan2025.json");
const charcount_np_part2 = await loadJSON("/public/files/charcount_scaled_part2_np_jan2025.json");
const CHARCOUNT_NP = charcount_np_part1.concat(charcount_np_part2);
const CHEBI_NP = await loadJSON("/public/files/charcount_chebi_scaled_np_jan2025.json");

// Used in reaction_annotation.js
const REF_DAT = await loadJSON("/public/files/data2ref_mat_jan2025.json");
const REF_MAT_ROWS = REF_DAT["mrhea2sformula_keys"]; 
const REF_MAT_COLS = REF_DAT["all_formulas"]; 
const refMatPairs = REF_DAT["nonzero_vals"];

let REF_MAT = math.zeros(REF_MAT_ROWS.length, REF_MAT_COLS.length, 'sparse');
refMatPairs.forEach(([colIndex, nonZeroRows]) => {
  nonZeroRows.forEach(rowIndex => {
    REF_MAT.set([rowIndex, colIndex], 1);
  });
});

class Recommendation {
  constructor(id, candidates, urls, labels) {
    this.id = id;
    this.candidates = candidates;
    this.urls = urls;
    this.labels = labels;
  }
}

const cn = {
  CANDIDATES,
  CHEBI,
  OBO_CHEBI,
  EC,
  EC_HEADER,
  KEGG_HEADER,
  GO,
  RHEA,
  RHEA_HEADER,
  KEGG_REACTION,
  MATCH_SCORE,
  NAME_USED,
  FORMULA,
  QUERY_DF,
  RECALL,
  PRECISION,
  ROUND_DIGITS,
  TOLERANCE,
  DF_MATCH_SCORE_COL,
  DF_UPDATE_ANNOTATION_COL,
  CHEBI_DEFAULT_URL,
  RHEA_DEFAULT_URL,
  REF_CHEBI2FORMULA,
  REF_EC2RHEA,
  REF_KEGG2RHEA,
  REF_RHEA2MASTER,
  REF_CHEBI2LABEL,
  REF_RHEA2LABEL,
  REF_RHEA2ECKEGG,
  CHARCOUNT_NP,
  CHEBI_NP,
  REF_MAT,
  REF_MAT_ROWS,
  REF_MAT_COLS,
  Recommendation,
};

export default cn;
