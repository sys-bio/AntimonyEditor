import Recommender from "./recommender";

/**
 * Generates annotation recommendations for a given SBML model.
 *
 * This method processes an SBML file string, analyzes species and reactions,
 * and generates recommendations for annotations based on specified criteria.
 *
 * @param {Object} params - Params for annotation recommendations.
 * @param {string} params.file - The SBML model file (.xml) contents as a string.
 * @param {string} params.fileName - The SBML model file (.xml) name.
 * @param {number} [params.cutoff=0.0] - Match score cutoff for recommendations.
 *                                       Only candidates above this score will be recommended.
 *                                       Defaults to "0.0".
 * @param {string} [params.mssc="top"] - Match Score Selection Criteria:
 *                                       "top" recommends the best candidates,
 *                                       while "above" includes all candidates
 *                                       above the cutoff. Defaults to "top".
 *
 * @returns {Promise<Object[]>} A Promise that resolves to an array of objects,
 *                              each representing a recommendation with relevant details
 *                              (e.g., species/reaction ID, suggested annotation, score)
 *
 * @throws {Error} If annotation processing encounters an issue.
 */
export async function recommendAnnotation({
  file,
  fileName,
  cutoff = 0.0,
  mssc = "top",
}) {
  return new Promise((resolve, reject) => {
    try {
      const recom = new Recommender({
        fileName: fileName,
        libsbmlContent: file,
      });

      const msscOption = mssc.toLowerCase();

      const speciesIDs = recom.getSpeciesIDs();
      console.log(`Analyzing ${speciesIDs.length} species...\n`);

      const reactionIDs = recom.getReactionIDs();
      console.log(`Analyzing ${reactionIDs.length} reaction(s)...\n`);

      // Generate recommendations
      const recommendationsTable = recom.recommendAnnotation({
        mssc: msscOption,
        cutoff,
      });
      console.log("Recommendations completed");

      resolve(recommendationsTable);
    } catch (error) {
      reject(`Error processing annotation: ${error}`);
    }
  });
}

export async function createRecommender({ file, fileName }) {
  return new Promise((resolve, reject) => {
    try {
      const recom = new Recommender({
        fileName: fileName,
        libsbmlContent: file,
      });

      const speciesIDs = recom.getSpeciesIDs();
      const reactionIDs = recom.getReactionIDs();
      console.log(
        `Analyzing ${speciesIDs.length} species and ${reactionIDs.length} reaction(s)...`
      );

      resolve(recom);
    } catch (error) {
      reject(`Error processing annotation: ${error}`);
    }
  });
}

export async function predictSpecies({ recom, mssc, cutoff }) {
  return new Promise((resolve, reject) => {
    try {
      const msscOption = mssc.toLowerCase();

      let predSpec;
      if (recom.species.names.length !== 0) {
        console.log(`Predicting ${recom.getSpeciesIDs().length} species...`);
        predSpec = recom.getSpeciesListRecommendation({
          predIds: recom.getSpeciesIDs(),
          mssc: msscOption,
          cutoff: cutoff,
          getDf: true,
        });
      }

      resolve(predSpec);
    } catch (error) {
      reject(`Error processing annotation: ${error}`);
    }
  });
}

export async function predictReactions({ recom, mssc, cutoff }) {
  return new Promise((resolve, reject) => {
    try {
      const msscOption = mssc.toLowerCase();

      let predReac;
      if (recom.reactions.reactionComponents.length !== 0) {
        console.log(`Predicting ${recom.getReactionIDs().length} reactions...`);
        predReac = recom.getReactionListRecommendation({
          predIds: recom.getReactionIDs(),
          mssc: msscOption,
          cutoff: cutoff,
          getDf: true,
        });
      }

      resolve(predReac);
    } catch (error) {
      reject(`Error processing annotation: ${error}`);
    }
  });
}

export async function createRecommendationTable({ recom, predSpec, predReac }) {
  console.log("Creating recommendations table...");
  const sDf = recom.getRecomTable("species", predSpec);
  const rDf = recom.getRecomTable("reaction", predReac);
  const resTab = sDf.concat(rDf);
  console.log("Recommendations completed");

  return resTab;
}
