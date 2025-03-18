import cn from "./constants";
import SpeciesAnnotation from "./species_annotation";
import ReactionAnnotation from "./reaction_annotation";
import AnnotationMaker from "./annotation_maker";
import {
  extractExistingSpeciesAnnotation,
  extractExistingReactionAnnotation,
  getAssociatedTermsToRhea,
} from "./tools";

/**
 * Recommender for running annotation predictions.
 */
class Recommender {
  /**
   * Constructor for initializing a Recommender instance.
   * Accepts SBML file (.xml) content directly.
   *
   * @param {Object} params - Initialization parameters.
   * @param {string} [params.fileName] - The name of the input SBML model file.
   * @param {string} [params.libsbmlContent] - The content of an SBML model file as a string.
   */
  constructor({ fileName = null, libsbmlContent = null }) {
    this.sbmlDocument = null;
    this.libsbml = window.libsbml;

    let specTuple = [];
    let reacTuple = [];

    if (fileName && libsbmlContent) {
      [specTuple, reacTuple] = this.parseSBML(libsbmlContent);
      this.fname = fileName;
    } else {
      this.fname = "uploaded_model";
    }

    // Initialize Species and Reaction annotations
    this.species = new SpeciesAnnotation({ inpTuple: specTuple });
    this.reactions = new ReactionAnnotation({ inpTuple: reacTuple });

    // Handling for user interaction and selection
    this.currentType = null;
    this.justDisplayed = null;
    this.selection = { species: {}, reaction: {} };
  }

  /**
   * Recommend species and reactions annotations.
   *
   * @param {Object} params - Input parameters for recommendation.
   * @param {string} [params.mssc='top'] - Recommendation method.
   * @param {number} [params.cutoff=0.0] - Minimum cutoff value for recommendations.
   * @returns List of Dataframe-like objects representing a table of annotation recommendations for species and reactions.
   */
  recommendAnnotation({ mssc = "top", cutoff = 0.0 }) {
    let predSpec;
    let predReac;

    if (this.species.names.length !== 0) {
      console.log("Predicting species...");
      predSpec = this.getSpeciesListRecommendation({
        predIds: this.getSpeciesIDs(),
        mssc: mssc,
        cutoff: cutoff,
        getDf: true,
      });
    }

    if (this.reactions.reactionComponents.length !== 0) {
      console.log("Predicting reactions...");
      predReac = this.getReactionListRecommendation({
        predIds: this.getReactionIDs(),
        mssc: mssc,
        cutoff: cutoff,
        getDf: true,
      });
    }

    console.log("Creating recommendations table...");
    const sDf = this.getRecomTable("species", predSpec);
    const rDf = this.getRecomTable("reaction", predReac);
    const resTab = sDf.concat(rDf);

    return resTab;
  }

  /**
   * Get annotation of multiple species, given as a list.
   * The `getSpeciesRecommendation` method is applied to each element.
   *
   * @param {string[]} predStrs - Species names to predict annotations with.
   * @param {string[]} predIds - Species IDs to predict annotations with
   *                             (model info should have been already loaded).
   * @param {string} mssc - Match score selection criteria:
   *                        - 'top': Recommend candidates with the highest match score above cutoff.
   *                        - 'above': Recommend all candidates with match scores above cutoff.
   * @param {number} cutoff - Cutoff value; only candidates with match scores
   *                          at or above the cutoff will be recommended.
   * @param {boolean} update - If true, update the current annotations
   *                           (i.e., replace or create new entries)
   *                           in `this.species.candidates` and `this.species.formula`.
   * @param {boolean} getDf - If true, return a list of DataFrame-like objects.
   *                          If false, return a list of Recommendation objects.
   * @returns {Array} - List of Recommendations (objects or strings, depending on `getDf`).
   */
  getSpeciesListRecommendation({
    predStrs = [],
    predIds = [],
    mssc = "top",
    cutoff = 0.0,
    update = true,
    getDf = false,
  }) {
    let idsDict = {};
    let inpStrs = [];

    if (predStrs.length > 0) {
      idsDict = predStrs.reduce((acc, spec) => {
        acc[spec] = spec;
        return acc;
      }, {});
      inpStrs = predStrs;
    } else if (predIds.length > 0) {
      idsDict = predIds.reduce((acc, id) => {
        acc[id] = this.species.getNameToUse(id);
        return acc;
      }, {});
      inpStrs = Object.values(idsDict);
    }

    const predRes = this.species.getCScores({
      inpStrs,
      mssc,
      cutoff,
    });

    let result = [];
    for (const species in idsDict) {
      const chebiResults = predRes[idsDict[species]];
      if (!chebiResults) {
        continue;
      }

      // Generate URLs and labels
      const urls = chebiResults.map(
        (val) => cn.CHEBI_DEFAULT_URL + val[0].slice(6)
      );
      const labels = chebiResults.map((val) => cn.REF_CHEBI2LABEL[val[0]]);

      // Create recommendations
      const oneRecom = new cn.Recommendation(
        species,
        chebiResults.map((val) => [
          val[0],
          Math.round(val[1] * Math.pow(10, cn.ROUND_DIGITS)) /
            Math.pow(10, cn.ROUND_DIGITS),
        ]),
        urls,
        labels
      );

      result.push(oneRecom);

      // Update species with recommendation if specified
      if (update) {
        this.species.updateSpeciesWithRecommendation(oneRecom);
      }
    }

    // Return recommendations or dataframe based on `getDf`
    if (getDf) {
      return result.map((val) =>
        this.getDataFrameFromRecommendation({ rec: val })
      );
    }

    return result;
  }

  /**
   * Get annotation of multiple reactions, given as a list.
   * Instead of applying `getReactionRecommendation` for each reaction,
   * this method predicts all component species first and proceeds to reduce computational cost.
   *
   * @param {string[]} predIds - Reaction IDs to predict annotations for.
   * @param {Array} specRes - Optional list of species recommendations.
   *                          If provided, species will not be predicted for remaining species.
   * @param {string} mssc - Match score selection criteria:
   *                        - 'top': Recommend candidates with the highest match score above cutoff.
   *                        - 'above': Recommend all candidates with match scores above cutoff.
   * @param {number} cutoff - Cutoff value; only candidates with match scores
   *                          at or above the cutoff will be recommended.
   * @param {boolean} update - If true, update the current reaction annotations
   *                           in `this.reactions.candidates`.
   * @param {boolean} getDf - If true, return a list of DataFrame-like objects.
   *                          If false, return a list of Recommendation objects.
   * @returns {Array} - List of Recommendations (objects or strings, depending on `getDf`).
   */
  getReactionListRecommendation({
    predIds = [],
    specRes = [],
    mssc = "top",
    cutoff = 0.0,
    update = true,
    getDf = false,
  }) {
    let specsToAnnotate = [
      ...new Set(
        predIds.flatMap((val) => this.reactions.reactionComponents[val])
      ),
    ];

    let predFormulas = {};
    let remainingSpecies = [...specsToAnnotate];

    // Get annotation of collected species
    if (remainingSpecies.length > 0) {
      let specResults = [];
      if (specRes.length > 0) {
        specResults = specRes.filter((val) =>
          remainingSpecies.includes(val.id)
        );
      } else {
        // No updates. Use default MSSC 'top', cutoff '0.0'.
        specResults = this.getSpeciesListRecommendation({
          predIds: remainingSpecies,
          update: false,
        });
      }

      specResults.forEach((oneRecom) => {
        let chebis = oneRecom.candidates.map((val) => val[0]);
        let forms = [
          ...new Set(
            chebis
              .filter((k) => cn.REF_CHEBI2FORMULA.hasOwnProperty(k))
              .map((k) => cn.REF_CHEBI2FORMULA[k])
          ),
        ];
        predFormulas[oneRecom.id] = forms;
      });
    }

    // Predict reaction annotations
    const predRes = this.reactions.getRScores({
      specDict: predFormulas,
      reacs: predIds,
      mssc: mssc,
      cutoff: cutoff,
    });

    let result = [];
    for (const reaction in predRes) {
      const urls = predRes[reaction].map(
        (val) => cn.RHEA_DEFAULT_URL + val[0].slice(5)
      );
      const labels = predRes[reaction].map((val) => cn.REF_RHEA2LABEL[val[0]]);

      const oneRecom = new cn.Recommendation(
        reaction,
        predRes[reaction].map((val) => [
          val[0],
          Math.round(val[1] * Math.pow(10, cn.ROUND_DIGITS)) /
            Math.pow(10, cn.ROUND_DIGITS),
        ]),
        urls,
        labels
      );

      result.push(oneRecom);
    }

    if (update) {
      this.reactions.candidates = predRes;
    }

    if (getDf) {
      return result.map((val) =>
        this.getDataFrameFromRecommendation({ rec: val })
      );
    }

    return result;
  }

  /**
   * Returns all available species IDs that exist in the model.
   *
   * @returns {Array} - List of matching species IDs.
   */
  getSpeciesIDs() {
    const speciesIDs = Object.keys(this.species.names ?? {});
    return speciesIDs;
  }

  /**
   * Get all reaction IDs.
   *
   * @returns {Array} - List of matching reaction IDs.
   */
  getReactionIDs() {
    const reactions = Object.keys(this.reactions.reactionComponents ?? {});
    return reactions;
  }

  /**
   * Parse SBML content and return species and reaction annotations.
   *
   * @param {string} libsbmlContent - The SBML content as a string.
   * @returns {Array} An array containing two tuples: species and reaction data.
   */
  parseSBML(libsbmlContent) {
    const { SBMLReader } = this.libsbml;

    const reader = new SBMLReader();
    this.sbmlDocument = reader.readSBMLFromString(libsbmlContent);
    const model = this.sbmlDocument.getModel();

    const existingSpeciesAnnotation = extractExistingSpeciesAnnotation(model);
    const speciesNames = {};
    for (let i = 0; i < model.getNumSpecies(); i++) {
      const species = model.getSpecies(i);
      speciesNames[species.getId()] = species.getName();
    }
    const speciesTuple = [speciesNames, existingSpeciesAnnotation];

    const existingReactionAnnotation = extractExistingReactionAnnotation(model);
    const reactionComponents = {};
    for (let i = 0; i < model.getNumReactions(); i++) {
      const reaction = model.getReaction(i);
      const reactants = [];
      const products = [];

      for (let j = 0; j < reaction.getNumReactants(); j++) {
        const reactant = reaction.getReactant(j);
        reactants.push(reactant.getSpecies());
      }

      for (let j = 0; j < reaction.getNumProducts(); j++) {
        const product = reaction.getProduct(j);
        products.push(product.getSpecies());
      }

      // Combine reactants and products
      reactionComponents[reaction.getId()] = Array.from(
        new Set([...reactants, ...products])
      );
    }
    const reactionTuple = [reactionComponents, existingReactionAnnotation];

    return [speciesTuple, reactionTuple];
  }

  /**
   * Get a Dataframe-like object from a single recommendation.
   *
   * @param {Recommendation} rec - A Recommendation containing the data.
   * @param {boolean} showUrl - If false, omits the URL column.
   *
   * @returns {Object} - A JavaScript object representing the dataframe.
   */
  getDataFrameFromRecommendation({ rec, showUrl = false }) {
    // Extract candidates and match scores from the recommendation
    const candidates = rec.candidates.map((val) => val[0]);
    const matchScores = rec.candidates.map((val) => val[1]);

    // Labels for the candidates
    const labels = rec.labels;

    // Construct the "dataframe" (represented as an object in JavaScript)
    const dataframe = {
      annotation: candidates,
      [cn.DF_MATCH_SCORE_COL]: matchScores,
      label: labels,
    };

    dataframe.indexName = rec.id;

    if (showUrl) {
      const urls = rec.urls;
      dataframe.url = urls;
    }

    return dataframe;
  }

  /**
   * Extends the Dataframe-like object using list of recommendations.
   *
   * @param {string} elementType - Either 'species' or 'reaction'.
   * @param {Array<Object>} recommended - List of recommendations from get[elementType]ListRecommendation method.
   * @returns {Array<Object>} - List of Dataframe-like objects.
   */
  getRecomTable(elementType, recommended) {
    const model = this.sbmlDocument.getModel();

    const TYPE_EXISTING_ATTR = {
      species: this.species.existingAnnotation,
      reaction: this.reactions.existingAnnotation,
    };

    const ELEMENT_FUNC = {
      species: (id) => {
        for (let i = 0; i < model.getNumSpecies(); i++) {
          let species = model.getSpecies(i);
          if (id === species.getId()) {
            return species;
          }
        }
        return null;
      },
      reaction: (id) => {
        for (let i = 0; i < model.getNumReactions(); i++) {
          let reaction = model.getReaction(i);
          if (id === reaction.getId()) {
            return reaction;
          }
        }
        return null;
      },
    };

    const TYPE_LABEL = {
      species: cn.REF_CHEBI2LABEL,
      reaction: cn.REF_RHEA2LABEL,
    };

    let edfs = [];
    recommended.forEach((oneEdf) => {
      const elementId = oneEdf.indexName;

      if (oneEdf.annotation.length === 0) return;

      const annotations = oneEdf["annotation"];
      const matchScores = oneEdf[cn.DF_MATCH_SCORE_COL];
      const labels = oneEdf["label"];

      let annotationsThatExist = [];
      let annotationsToKeep = [];
      let annotationsToAdd = [];

      const existingAnnotations = TYPE_EXISTING_ATTR[elementType][elementId];

      if (existingAnnotations) {
        annotationsThatExist = annotations.map((val) =>
          existingAnnotations.includes(val) ? 1 : 0
        );
        annotationsToKeep = annotations.map((val) =>
          existingAnnotations.includes(val) ? "keep" : "ignore"
        );
        const annotationsToAddRaw = existingAnnotations.filter(
          (val) => !annotations.includes(val)
        );
        annotationsToAdd = annotationsToAddRaw.filter(
          (val) => TYPE_LABEL[elementType][val]
        );
      } else {
        annotationsThatExist = Array(annotations.length).fill(0);
        annotationsToKeep = Array(annotations.length).fill("ignore");
      }

      annotationsToAdd.forEach((newAnnot) => {
        annotations.push(newAnnot);
        if (elementType === "reaction") {
          matchScores.push(this.getMatchScoreOfRhea(elementId, newAnnot));
          labels.push(cn.REF_RHEA2LABEL[newAnnot]);
        } else if (elementType === "species") {
          matchScores.push(this.getMatchScoreOfChebi(elementId, newAnnot));
          labels.push(cn.REF_CHEBI2LABEL[newAnnot]);
        }
        annotationsThatExist.push(1);
        annotationsToKeep.push("keep");
      });

      const newEdf = annotations.map((annotation, index) => {
        const element = ELEMENT_FUNC[elementType](elementId);
        return {
          type: elementType,
          id: elementId,
          displayName: element ? element.getName() : "",
          metaId: element ? element.getMetaId() : "",
          annotation: annotation,
          annotationLabel: labels[index],
          [cn.DF_MATCH_SCORE_COL]: matchScores[index],
          existing: annotationsThatExist[index],
          [cn.DF_UPDATE_ANNOTATION_COL]: annotationsToKeep[index],
        };
      });

      edfs.push(...newEdf);
    });

    return edfs;
  }

  /**
   * Calculate match score of a species (by ID) with a ChEBI term.
   * This function informs the user of how well the species matches a specific ChEBI term.
   * If the ChEBI term does not exist in the dictionary, 0.0 will be returned.
   *
   * @param {string} inpId - ID of the species.
   * @param {string} inpChebi - A ChEBI term.
   * @returns {number} res - The match score (or 0.0 if not found).
   */
  getMatchScoreOfChebi(inpId, inpChebi) {
    const inpStr = this.species.getNameToUse(inpId);

    const scores = this.species.getCScores({
      inpStrs: [inpStr],
      mssc: "above",
      cutoff: 0.0,
    })[inpStr];

    // Search for the match score corresponding to the ChEBI term if it exists.
    const match = scores.find((v) => v[0] === inpChebi);

    // If found, return the rounded match score.
    // Otherwise, return 0.0.
    const result = match
      ? Math.round(match[1] * Math.pow(10, cn.ROUND_DIGITS)) /
        Math.pow(10, cn.ROUND_DIGITS)
      : 0.0;

    return result;
  }

  /**
   * Calculate match score of a reaction (by ID) with a Rhea term.
   * This function informs the user of how well the reaction matches a specific Rhea term.
   *
   * @param {string} inpId - ID of the reaction.
   * @param {string} inpRhea - A Rhea term.
   * @returns {number} resMatchScore - The match score (or 0.0 if not found).
   */
  getMatchScoreOfRhea(inpId, inpRhea) {
    const specsToPredict = this.reactions.reactionComponents[inpId];
    const specResults = this.getSpeciesListRecommendation({
      predIds: specsToPredict,
      mssc: "top",
      cutoff: 0.0,
      update: false,
    });

    const predFormulas = {};
    for (let oneSpecRes of specResults) {
      const chebis = oneSpecRes.candidates.map((val) => val[0]);
      const forms = [
        ...new Set(chebis.filter((k) => cn.REF_CHEBI2FORMULA[k])),
      ].map((k) => cn.REF_CHEBI2FORMULA[k]);
      predFormulas[oneSpecRes.id] = forms;
    }

    // Get the reaction scores based on the predicted formulas.
    const scores = this.reactions.getRScores({
      specDict: predFormulas,
      reacs: [inpId],
      mssc: "above",
      cutoff: 0.0,
    })[inpId];

    // Find the match score for the given Rhea term.
    const match = scores.find((v) => v[0] === inpRhea);

    // If found, return the rounded match score.
    // Otherwise, return 0.0.
    const result = match
      ? Math.round(match[1] * Math.pow(10, cn.ROUND_DIGITS)) /
        Math.pow(10, cn.ROUND_DIGITS)
      : 0.0;

    return result;
  }

  /**
   * Create an updated SBML document based on the feedback.
   * If autoFeedback is true, replace 'ignore' with 'add'
   * and subsequently update the file.
   *
   * @param {Object} sbmlDocument - The SBML document.
   * @param {Array<Recommendation>} chosen - The selected annotations.
   * @param {boolean} [autoFeedback=false] - Whether to auto-replace 'ignore' with 'add'.
   * @returns {Object} Updated SBML document.
   */
  getSBMLDocument({ sbmlDocument, chosen, autoFeedback = false }) {
    const model = sbmlDocument.getModel();

    if (autoFeedback) {
      chosen.forEach((item) => {
        if (item.updateAnnotation === "ignore") {
          item.updateAnnotation = "add";
        }
      });
    }

    const elementTypes = [...new Set(chosen.map((item) => item.type))];

    const ELEMENT_FUNC = {
      species: (id) => {
        for (let i = 0; i < model.getNumSpecies(); i++) {
          let species = model.getSpecies(i);
          if (id === species.getId()) {
            return species;
          }
        }
        return null;
      },
      reaction: (id) => {
        for (let i = 0; i < model.getNumReactions(); i++) {
          let reaction = model.getReaction(i);
          if (id === reaction.getId()) {
            return reaction;
          }
        }
        return null;
      },
    };

    elementTypes.forEach((oneType) => {
      const maker = new AnnotationMaker({ element: oneType });

      const ofType = chosen.filter((item) => item.type === oneType);
      const uids = [...new Set(ofType.map((item) => item.id))];

      const metaIds = {};
      uids.forEach((oneId) => {
        const metaItem = ofType.find((item) => item.id === oneId);
        if (metaItem) {
          metaIds[oneId] = metaItem.metaId;
        }
      });

      uids.forEach((oneId) => {
        const element = ELEMENT_FUNC[oneType](oneId);
        if (!element) return;
        let origStr = element.getAnnotationString();

        const dels = ofType
          .filter(
            (item) =>
              item.id === oneId &&
              item[cn.DF_UPDATE_ANNOTATION_COL] === "delete"
          )
          .map((item) => item.annotation);

        let addsRaw = ofType
          .filter(
            (item) =>
              item.id === oneId && item[cn.DF_UPDATE_ANNOTATION_COL] === "add"
          )
          .map((item) => item.annotation);

        const keeps = ofType
          .filter(
            (item) =>
              item.id === oneId && item[cn.DF_UPDATE_ANNOTATION_COL] === "keep"
          )
          .map((item) => item.annotation);

        addsRaw = [...new Set([...addsRaw, ...keeps])];

        // Remove Rhea
        let adds = addsRaw.map((oneAdd) =>
          oneAdd.toLowerCase().startsWith("rhea") ? oneAdd.slice(5) : oneAdd
        );

        let deled;
        if (oneType === "reaction") {
          const rheaDelTerms = dels.flatMap((val) =>
            getAssociatedTermsToRhea(val)
          );
          deled = maker.deleteAnnotation([...new Set(rheaDelTerms)], origStr);
        } else if (oneType === "species") {
          deled = maker.deleteAnnotation(dels, origStr);
        }

        const added = maker.addAnnotation(adds, deled, metaIds[oneId]);
        element.setAnnotation(added);
      });
    });

    const { SBMLWriter } = this.libsbml;

    const writer = new SBMLWriter();
    const sbmlString = writer.writeSBMLToString(sbmlDocument);

    return sbmlString;
  }
}

export default Recommender;
