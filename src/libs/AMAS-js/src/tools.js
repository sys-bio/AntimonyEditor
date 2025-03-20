import cn from "./constants";

/**
 * Apply MSSC (Match Score Selection Criteria) to predicted results.
 * If the cutoff is too high, returns an empty array.
 *
 * @param {Array} pred - List of tuples [[CHEBI:XXXXX, score], ...].
 * @param {string} mssc - Match score selection criteria:
 *                        - 'top': Select candidates with the highest match score.
 *                        - 'above': Select all candidates above the cutoff.
 * @param {number} cutoff - Cutoff value; only candidates with scores >= cutoff are considered.
 * @returns {Array} - Filtered list of tuples [(CHEBI:XXXXX, score), ...].
 */
export function applyMSSC(pred, mssc, cutoff) {
  // Filter predictions based on cutoff
  const filteredPred = pred.filter(([_, score]) => score >= cutoff);
  if (filteredPred.length === 0) {
      return [];
  }

  let resultPred;
  if (mssc === 'top') {
      // Find the maximum score
      let maxScore = -Infinity;
      for (let i = 0; i < filteredPred.length; i++) {
        maxScore = Math.max(maxScore, filteredPred[i][1]);
      }
      // Filter predictions with the maximum score
      resultPred = filteredPred.filter(([_, score]) => score === maxScore);
  } else if (mssc === 'above') {
      // Return all filtered predictions
      resultPred = filteredPred;
  }

  return resultPred;
}

/**
 * Extract existing species annotations that contain ChEBI terms.
 * 
 * @param {Object} inpModel - The SBML model object.
 * @returns {Object} - Filtered annotations.
 */
export function extractExistingSpeciesAnnotation(inpModel) {
  const existRaw = {};

  for (let i = 0; i < inpModel.getNumSpecies(); i++) {
    const species = inpModel.getSpecies(i)
    existRaw[species.getId()] = getQualifierFromString(species.getAnnotationString(), [cn.CHEBI, cn.OBO_CHEBI]);
  }

  const existFilt = {};
  Object.keys(existRaw).forEach((key) => {
    if (existRaw[key]) {
      existFilt[key] = existRaw[key];
    }
  });

  return existFilt;
}

/**
 * Extract existing reaction annotations (Rhea-BI format).
 * 
 * @param {Object} inpModel - The SBML model object.
 * @returns {Object} - Filtered reaction annotations.
 */
export function extractExistingReactionAnnotation(inpModel) {
  const existRaw = {};

  for (let i = 0; i < inpModel.getNumReactions(); i++) {
    const reaction = inpModel.getReaction(i)
    existRaw[reaction.getId()] = extractRheaFromAnnotationString(reaction.getAnnotationString());
  }

  const existFilt = {};
  Object.keys(existRaw).forEach((key) => {
    if (existRaw[key]) {
      existFilt[key] = existRaw[key];
    }
  });

  return existFilt;
}

/**
 * Extract Rhea from existing annotation string,
 * by directly extracting Rhea, and converting from KEGG and EC-Code.
 *
 * @param {string} inpStr - The input string containing annotations.
 * @returns {Array} - A list of unique Rhea identifiers.
 */
export function extractRheaFromAnnotationString(inpStr) {
  // Extract Rhea terms from the input string and map to Rhea-BI
  const existRheas = getQualifierFromString(inpStr, cn.RHEA)
                      .map(val => formatRhea(val));
  const mapRheaBis = existRheas.filter(val => cn.REF_RHEA2MASTER[val])
                               .map(val => cn.REF_RHEA2MASTER[val]);

  // Extract KEGG reactions and map to Rhea
  const existKeggs = getQualifierFromString(inpStr, cn.KEGG_REACTION)
                      .map(val => cn.KEGG_HEADER + val);
  const mapKegg2Rhea = existKeggs.flatMap(val => cn.REF_KEGG2RHEA[val] || []);

  // Extract EC codes and map to Rhea
  const existEcs = getQualifierFromString(inpStr, cn.EC)
                     .map(val => cn.EC_HEADER + val);
  const mapEc2Rhea = existEcs.flatMap(val => cn.REF_EC2RHEA[val] || []);

  return Array.from(new Set([...mapRheaBis, ...mapKegg2Rhea, ...mapEc2Rhea]));
}

/**
 * Format Rhea values.
 * If 'RHEA:' is not in the name, add it.
 * Otherwise, ignore it.
 *
 * @param {string} oneRhea - The Rhea value to format.
 * @returns {string} - The formatted Rhea string.
 */
export function formatRhea(oneRhea) {
  let strToAdd = oneRhea.toLowerCase().startsWith('rhea') 
                 ? oneRhea.slice(5) 
                 : oneRhea;
  return cn.RHEA_HEADER + strToAdd;
}

/**
 * Parse string and return string annotation,
 * marked as <bqbiol:is> or <bqbiol:isVersionOf>.
 * If neither exists, return an empty array.
 *
 * @param {string} stringAnnotation - The string to parse.
 * @param {Array} bqbiolQualifiers - List of qualifiers. Defaults to ['is', 'isVersionOf'].
 * @returns {Array} - List of tuples containing ontology type and ontology ID.
 */
export function getOntologyFromString(stringAnnotation, bqbiolQualifiers = ['is', 'isVersionOf']) {
  let combinedStr = '';

  bqbiolQualifiers.forEach(qualifier => {
    const oneMatch = `<bqbiol:${qualifier}[^a-zA-Z].*?</bqbiol:${qualifier}>`;
    const oneMatched = stringAnnotation.match(new RegExp(oneMatch, 'gs'));

    if (oneMatched && oneMatched.length > 0) {
      const matchedFilt = oneMatched.map(s => s.replace("      ", "")); 
      const oneStr = matchedFilt.join('\n');
      combinedStr += oneStr;
    }
  });

  // Find all identifiers matching the pattern for identifiers.org
  const identifiersList = combinedStr.match(/identifiers\.org\/.*\//g);

  // Process the identifiers into the result format
  const resultIdentifiers = identifiersList ? identifiersList.map(r => {
    const parts = r.split('/');
    return [parts[1], parts[2].replace('"', '')];
  }) : [];

  return resultIdentifiers;
}

/**
 * Parses a string and returns an identifier based on the provided qualifier.
 * If none is found, returns an empty array.
 * Qualifier can be either a string or a list of strings.
 *
 * @param {string} inpStr - The input annotation string.
 * @param {string|Array} qualifier - The qualifier (or list of qualifiers).
 * @returns {Array} - An array of ontology IDs found in the string.
 */
export function getQualifierFromString(inpStr, qualifier) {
  const ontologies = getOntologyFromString(inpStr);
  
  let qualifierList = [];
  
  // Ensure comparison is case-insensitive
  if (typeof qualifier === 'string') {
    qualifierList = ontologies.filter(val => val[0].toLowerCase() === qualifier.toLowerCase());
  } else if (Array.isArray(qualifier)) {
    const lowerQualifiers = qualifier.map(q => q.toLowerCase());
    qualifierList = ontologies.filter(val => lowerQualifiers.includes(val[0].toLowerCase()));
  }

  if (qualifierList.length > 0) {
    return qualifierList.map(val => val[1]);
  }

  return [];
}

/**
 * Transforms a list of CHEBI terms into a list of annotations based on a reference dictionary.
 *
 * @param {Array<string>} inpList - List of CHEBI terms.
 * @param {Object} referenceToFormulaDict - A dictionary mapping CHEBI terms to formulas.
 * @returns {Array<string>} - A list of unique, non-null formulas derived from the input list.
 */
export function transformCHEBIToFormula(inpList, referenceToFormulaDict) {
  const inputFormulas = inpList
    .filter((val) => val in referenceToFormulaDict) 
    .map((val) => referenceToFormulaDict[val]);

  const result = [...new Set(inputFormulas.filter((val) => val !== null && val !== undefined))];

  return result;
}

/**
 * Get a list of associated terms of a Rhea term.
 * The resulting list will contain the original Rhea term,
 * along with associated EC & KEGG numbers.
 *
 * @param {string} inpRhea - The input Rhea term.
 * @returns {string[]} - A list containing the original Rhea term and its associated EC & KEGG numbers.
 */
export function getAssociatedTermsToRhea(inpRhea) {
  if (cn.REF_RHEA2ECKEGG.hasOwnProperty(inpRhea)) {
    return [...cn.REF_RHEA2ECKEGG[inpRhea], inpRhea];
  } else {
    return [inpRhea];
  }
}
