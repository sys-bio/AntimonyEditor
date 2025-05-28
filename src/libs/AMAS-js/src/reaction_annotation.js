import * as math from 'mathjs'

import cn from "./constants";
import { applyMSSC } from "./tools";

class ReactionAnnotation {
  /**
   * Constructor for initializing a ReactionAnnotation instance.
   *
   * @param {Array|null} inpTuple - A tuple containing two objects:
   *                                 - reaction_id: Species involved in the reaction.
   *                                 - reaction_id: Rhea terms (or other annotations).
   */
  constructor({ inpTuple = null }) {
    this.model = null;
    this.reactionComponents = null;
    this.existingAnnotation = null;

    if (inpTuple !== null) {
      this.reactionComponents = inpTuple[0];
      this.existingAnnotation = inpTuple[1];
    }

    this.candidates = null;
    this.queryDataFrame = null;
  }

  /**
   * Get a sorted list of Rhea-rScore tuples.
   * [(RHEA:XXXXX, 1.0), etc.]
   * 
   * @param {Object} specDict - Dictionary of species ID -> formula (Array of strings).
   * @param {string[]} reacs - IDs of reactions to predict annotations.
   * @param {string} mssc - Match score selection criteria:
   *   - 'top': Recommend candidates with the highest match score above cutoff.
   *   - 'above': Recommend all candidates with match scores above cutoff.
   * @param {number} cutoff - Cutoff value; only candidates with match score
   *                          at or above the cutoff will be recommended.
   * @returns {Object} - Dictionary of {reactionId: [(Rhea:XXXXX, score), ...]}.
   */
  getRScores({ specDict, reacs, mssc, cutoff }) {
    let queryMatrix = math.zeros(cn.REF_MAT_COLS.length, reacs.length, 'sparse');

    reacs.forEach((oneRid, colIndex) => {
      this.reactionComponents[oneRid]
        .map(spec => specDict[spec])
        .flat()
        .forEach(val => {
          const rowIndex = cn.REF_MAT_COLS.indexOf(val);
          if (rowIndex !== -1) {
            queryMatrix.set([rowIndex, colIndex], 1);
          }
        });
    });

    const multipliedMatrix = math.multiply(cn.REF_MAT, queryMatrix);

    // New minimax of reference value
    const numCols = reacs.length;
    let maxMultipliedMatrix = math.max(multipliedMatrix, 0);
    let queryColSum = math.zeros(numCols);

    console.time("ReactionMatrixTime")
    // Convert matrices to native arrays just once
    const multiplied = multipliedMatrix.toArray();           // shape: [rows][cols]
    const maxVals = maxMultipliedMatrix.toArray();           // shape: [cols][1]
    const refMat = cn.REF_MAT.toArray();                     // shape: [rows][features]

    for (let col = 0; col < numCols; col++) {
      const maxVal = maxVals[col][0];
      const matchingIndices = [];

      // Find matching rows (i.e. where this col hits max value)
      for (let row = 0; row < multiplied.length; row++) {
        if (multiplied[row][col] === maxVal) {
          matchingIndices.push(row);
        }
      }

      // Find min row sum in REF_MAT over these matching rows
      let minSum = Infinity;
      for (let rowIdx of matchingIndices) {
        const row = refMat[rowIdx];
        let sum = 0;
        for (let val of row) sum += val;
        if (sum < minSum) minSum = sum;
      }

      queryColSum.set([col], minSum);
    }

    // Old matrix math.js based algorithm
    // for (let col = 0; col < numCols; col++) {
    //   // Find the rows that contain the max column values
    //   let matchingIndices = [];
    //   for (let row = 0; row < multipliedMatrix.size()[0]; row++) {
    //     if (multipliedMatrix.get([row, col]) === maxMultipliedMatrix.get([col, 0])) {
    //       matchingIndices.push(row);
    //     }
    //   }

    //   // Extract rows from REF_MAT that contain the max column values
    //   let selectedRows = matchingIndices.map(i => cn.REF_MAT.subset(math.index(i, math.range(0, cn.REF_MAT.size()[1]))));
      
    //   // Compute row sums
    //   let rowSums = selectedRows.map(row => math.sum(row));

    //   // Find minimum row sum
    //   queryColSum.set([col], Math.min(...rowSums));
    // }
    console.timeEnd("ReactionMatrixTime")
    // Reshape queryColSum into a column vector (math.js matrix)
    queryColSum = math.transpose(math.reshape(queryColSum, [queryColSum.size()[0], 1]));

    const divMatrix = math.dotDivide(multipliedMatrix, queryColSum)

    const rScores = {};
    const numRows = divMatrix.size()[0];
    reacs.forEach((reac, col) => { 
      let reacPred = {};
      for (let row = 0; row < numRows; row++) {
        const rheaLabel = cn.REF_MAT_ROWS[row];
        const val = divMatrix.get([row, col]);
        reacPred[rheaLabel] = val;
      }      
  
      // Apply MSSC
      let reacRScore = applyMSSC(
        Object.entries(reacPred),
        mssc,
        cutoff
      );
  
      reacRScore.sort((a, b) => b[1] - a[1]); 
  
      rScores[reac] = reacRScore;
    });

    return rScores;
  }
}

export default ReactionAnnotation;
