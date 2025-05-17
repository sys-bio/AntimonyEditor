import * as math from 'mathjs'

import cn from "./constants";
import { applyMSSC, transformCHEBIToFormula } from "./tools";

const REF_COLS = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
];

class SpeciesAnnotation {
  /**
   * Constructor for initializing a SpeciesAnnotation instance.
   *
   * @param {Array|null} inpTuple - A tuple containing two objects:
   *                                 - speciesId: speciesName.
   *                                 - speciesId: CHEBI annotations}.
   */
  constructor({ inpTuple = null }) {
    this.model = null;
    this.names = null;
    this.existingAnnotation = null;
    this.existingAnnotationFormula = null;

    if (inpTuple !== null) {
      this.names = inpTuple[0];
      this.existingAnnotation = inpTuple[1];

      const rawFormulaData = {};
      for (const [key, value] of Object.entries(inpTuple[1])) {
        rawFormulaData[key] = transformCHEBIToFormula(
          value,
          cn.REF_CHEBI2FORMULA
        );
      }

      this.existingAnnotationFormula = {};
      for (const [key, value] of Object.entries(rawFormulaData)) {
        if (value) {
          this.existingAnnotationFormula[key] = value;
        }
      }
    }

    this.candidates = {};
    this.formula = {};
  }

  /**
   * Compute the cScores of query strings with all possible ChEBI terms.
   * A sorted list of tuples (CHEBI:XXXXX, cScore) will be returned.
   * Only unique strings will be calculated to avoid repeated predictions.
   *
   * @param {Array<string>} inpStrs - List of input strings.
   * @param {string} mssc - Match score selection criteria:
   *                        'top': Recommend candidates with the highest match score.
   *                        'above': Recommend all candidates with match scores above the cutoff.
   * @param {number} cutoff - Cutoff value; only candidates with match scores >= cutoff are considered.
   * @returns {Object} - An object where keys are input strings and values are arrays of tuples [(CHEBI:XXXXX, score), ...].
   */
  getCScores({ inpStrs, mssc, cutoff }) {
    const uniqueStrs = [...new Set(inpStrs)];
    const oneQuery = this.prepareCounterQuery(uniqueStrs);

    const multipliedMatrix = math.multiply(cn.CHARCOUNT_NP, oneQuery);

    const cScores = {};
    inpStrs.forEach(species => {
      // Group by CHEBI and compute the max value for each CHEBI term
      let groupedResults = {}
      let numRows = multipliedMatrix.size()[0];
      for (let row = 0; row < numRows; row++) {
        const chebiLabel = cn.CHEBI_NP[row][0];
        const speciesValue = multipliedMatrix.get([row, uniqueStrs.indexOf(species)]);
        if (!groupedResults[chebiLabel]) {
          groupedResults[chebiLabel] = speciesValue;
        } else {
          groupedResults[chebiLabel] = Math.max(groupedResults[chebiLabel], speciesValue);
        }
      }

      // Apply MSSC
      cScores[species] = applyMSSC(
        Object.entries(groupedResults),
        mssc,
        cutoff,
      );
    });

    return cScores;
  }

  /**
   * Prepare a query vector to be used as predictor variables.
   * Input is a list of IDs to determine `names_used`. 
   * The query is scaled by the length of each vector.
   *
   * @param {Array<string>} species - IDs of species.
   * @returns {Object} - A normalized query matrix.
   */
  prepareCounterQuery(species) {
    let queryMatrix = math.zeros(REF_COLS.length, species.length);

    // Populate the query matrix based on character counts.
    species.forEach((name, speciesIndex) => {
      const charCounts = this.getCountOfIndividualCharacters(name);
    
      Object.entries(charCounts).forEach(([char, count]) => {
        if (REF_COLS.includes(char)) {
          const charIndex = REF_COLS.indexOf(char);
          queryMatrix.set([charIndex, speciesIndex], count);
        }
      });
    });

    let divRow = [];
    let numCols = queryMatrix.size()[1];
    for (let i = 0; i < numCols; i++) {
      const col = math.column(queryMatrix, i);
      divRow.push(math.norm(col.toArray().flat()));
    }
    const normQuery = math.dotDivide(queryMatrix, divRow);

    return normQuery;
  }

  /**
   * Get a count of individual characters (a-z and 0-9) from the input string.
   *
   * @param {string} inpStr - The input string.
   * @returns {Object} - An object representing the count of each character.
   */
  getCountOfIndividualCharacters(inpStr) {
    const matches = inpStr.toLowerCase().match(/[a-z0-9]+/g) || [];

    const charCounts = matches
      .join('') 
      .split('')
      .reduce((counter, char) => {
        counter[char] = (counter[char] || 0) + 1;
        return counter;
      }, {});

    return charCounts;
  }

  /**
   * Get the name to use for a given ID.
   * If the name is not '', use it. Otherwise, use the ID.
   *
   * @param {string} inpId - The ID of the model element.
   * @returns {string} - The name to use.
   */
  getNameToUse(inpId) {
    const speciesName = this.names[inpId];
    const resultName = speciesName && speciesName.length > 0 ? speciesName : inpId;
    return resultName;
  }

  /**
   * Update species_annotation class using the given Recommendation.
   *
   * this.candidates is a sorted list of tuples, (chebi_id: match_score)
   * this.formula is an unsorted list of unique formulas
   *
   * @param {Recommendation} inpRecom - A Recommendation instance.
   *                                     Created by recom.getSpeciesAnnotation
   */
  updateSpeciesWithRecommendation(inpRecom) {
    // Update the candidates
    this.candidates[inpRecom.id] = inpRecom.candidates;

    // Update the formulas
    const formulasToUpdate = [...new Set(inpRecom.candidates
      .filter(candidate => cn.REF_CHEBI2FORMULA[candidate[0]]) // Filter out candidates with no matching formula
      .map(candidate => cn.REF_CHEBI2FORMULA[candidate[0]]))]; // Get formulas associated with the candidates

    this.formula[inpRecom.id] = formulasToUpdate;
  }
}

export default SpeciesAnnotation;
