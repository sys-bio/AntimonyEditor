/**
 * Creates string annotations for AMAS recommendation.
 */
class AnnotationMaker {
  static RDF_TAG_ITEM = [
    "rdf:RDF",
    'xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"',
    'xmlns:dcterms="http://purl.org/dc/terms/"',
    'xmlns:vcard4="http://www.w3.org/2006/vcard/ns#"',
    'xmlns:bqbiol="http://biomodels.net/biology-qualifiers/"',
    'xmlns:bqmodel="http://biomodels.net/model-qualifiers/"',
  ];

  static RDF_TAG = AnnotationMaker.RDF_TAG_ITEM.join(" ");

  static MATCH_SCORE_BY = {
    species: "by_name",
    reaction: "by_component",
  };

  static KNOWLEDGE_RESOURCE = {
    species: "chebi",
    reaction: "rhea",
  };

  /**
   * @param {string} element - Either 'species' or 'reaction'
   * @param {string} [prefix='bqbiol:is'] - The prefix used for annotation.
   */
  constructor({ element, prefix = "bqbiol:is" }) {
    this.prefix = prefix;
    this.knowledgeResource = AnnotationMaker.KNOWLEDGE_RESOURCE[element];
    this.version = "v1";
    this.element = element;
    this.scoreBy = AnnotationMaker.MATCH_SCORE_BY[element];
  }

  /**
   * Create an empty annotation container that will hold the annotation blocks.
   *
   * @param {string[]} items - List of strings representing annotation items.
   * @returns {string[]} - The annotation container.
   */
  createAnnotationContainer(items) {
    let container = [];
    items.forEach((oneItem) => {
      const oneTag = this.createTag(oneItem);
      container = this.insertList(container, oneTag);
    });
    return container;
  }

  /**
   * Create a one-line annotation,
   * e.g., <rdf:li rdf:resource="http://identifiers.org/chebi/CHEBI:15414"/>
   *
   * @param {string} knowledgeResource - The knowledge resource (e.g., 'chebi').
   * @param {string} identifier - The identifier (e.g., 'CHEBI:15414').
   * @returns {string} - The created annotation string.
   */
  createAnnotationItem(knowledgeResource, identifier) {
    const annotationItems = ["identifiers.org", knowledgeResource, identifier];
    const resourcePath = annotationItems.join("/");
    const res = `<rdf:li rdf:resource="http://${resourcePath}"/>`;
    return res;
  }

  /**
   * Create a tag based on the given string.
   *
   * @param {string} tagStr - The tag string (e.g., 'rdf:li').
   * @returns {string[]} - An array with the opening and closing tag strings.
   */
  createTag(tagStr) {
    const headStr = tagStr;
    const tailStr = tagStr.split(" ")[0];
    const resTag = [`<${headStr}>`, `</${tailStr}>`];
    return resTag;
  }

  /**
   * Divide existing string annotation into an empty container and items.
   *
   * @param {string} inpStr - The input string to be divided.
   * @returns {Object|null} - An object with 'container' and 'items' properties, or null if it cannot be divided.
   */
  divideExistingAnnotation(inpStr) {
    const templateContainer = [];
    const items = [];

    if (!inpStr.includes("<rdf:Bag>")) {
      return null;
    }

    const existAnotList = inpStr.split("\n");
    let oneLine = "";

    while (oneLine.trim() !== "<rdf:Bag>" && existAnotList.length) {
      oneLine = existAnotList.shift();
      templateContainer.push(oneLine);
    }

    oneLine = existAnotList.shift();
    while (oneLine.trim() !== "</rdf:Bag>" && existAnotList.length) {
      items.push(oneLine.trim());
      oneLine = existAnotList.shift();
    }

    templateContainer.push(oneLine);
    while (existAnotList.length) {
      oneLine = existAnotList.shift();
      templateContainer.push(oneLine);
    }

    return { container: templateContainer, items: items };
  }

  /**
   * Get a string of annotations, using a list of strings (candidates).
   * Can replace a whole annotation.
   *
   * @param {string[]} candidates - List of candidates (e.g., ['CHEBI:12345', 'CHEBI:98765']).
   * @param {string} metaId - Meta ID of the element to be included in the annotation.
   * @returns {string} - The generated annotation string.
   */
  getAnnotationString(candidates, metaId) {
    const containerItems = [
      "annotation",
      AnnotationMaker.RDF_TAG,
      `rdf:Description rdf:about="#${metaId}"`,
      this.prefix,
      "rdf:Bag",
    ];
    const emptyContainer = this.createAnnotationContainer(containerItems);

    const itemsFrom = candidates.map((candidate) => {
      return this.createAnnotationItem(
        AnnotationMaker.KNOWLEDGE_RESOURCE[this.element],
        candidate
      );
    });

    const result = this.insertList(emptyContainer, itemsFrom);
    return result.join("\n");
  }

  /**
   * Returns a string of spaces for indentation.
   *
   * @param {number} [numIndents=0] - The number of indentations (spaces).
   * @returns {string} - A string containing the indentation.
   */
  getIndent(numIndents = 0) {
    return "  ".repeat(numIndents); // Two spaces per indent
  }

  /**
   * Insert a list into another list.
   *
   * @param {Array} insertTo - The list where the new list will be inserted.
   * @param {Array} insertFrom - The list from which items will be inserted.
   * @param {number} [startLoc=null] - The location at which to insert the list.
   *                                    If not provided, `insertFrom` will be added in the middle of `insertTo`.
   * @returns {Array} - The new list with `insertFrom` inserted at `startLoc`.
   */
  insertList(insertTo, insertFrom, startLoc = null) {
    if (startLoc === null) {
      startLoc = Math.floor(insertTo.length / 2);
    }

    const indents = this.getIndent(startLoc);
    const insertFromIndented = insertFrom.map((val) => indents + val);

    const beforeInsert = insertTo.slice(0, startLoc);
    const afterInsert = insertTo.slice(startLoc);

    return [...beforeInsert, ...insertFromIndented, ...afterInsert];
  }

  /**
   * Extract meta ID from the given annotation string by searching for
   * two strings: '#metaid_' and '>'.
   * If none are found, return an empty string.
   *
   * @param {string} inpStr - The annotation string.
   * @returns {string} - The extracted meta ID, or an empty string if not found.
   */
  extractMetaID(inpStr) {
    const metaIdRe = /rdf:about="#(.*)">/.exec(inpStr);
    if (metaIdRe === null) {
      return "";
    } else {
      return metaIdRe[1];
    }
  }

  /**
   * Adds terms to existing annotations. If no existing annotation is found, creates a new one.
   *
   * @param {string[]} terms - List of terms to be added.
   * @param {string} annotation - Existing element annotation.
   * @param {string} [metaId] - Optional meta ID; if not provided, it will be extracted if needed.
   * @returns {string} - Updated annotation string.
   */
  addAnnotation(terms, annotation, metaId = null) {
    const annotationDict = this.divideExistingAnnotation(annotation);

    if (!annotationDict) {
      if (!metaId) {
        metaId = this.extractMetaID(annotation);
      }
      return this.getAnnotationString(terms, metaId);
    }

    const { container, items: existingItems } = annotationDict;
    const existingIdentifiers = existingItems
      .map((val) => {
        const match = val.match(/"(.*?)"/);
        return match ? match[1].split("/").pop() : null;
      })
      .filter(Boolean);

    const additionalIdentifiers = terms.filter(
      (val) => !existingIdentifiers.includes(val)
    );

    const newItems = additionalIdentifiers.map((term) =>
      this.createAnnotationItem(
        AnnotationMaker.KNOWLEDGE_RESOURCE[this.element],
        term
      )
    );

    const updatedItems = existingItems.concat(newItems);
    return this.insertList(container, updatedItems).join("\n");
  }

  /**
   * Remove entire annotation by returning an empty string if all terms are deleted.
   *
   * @param {string[]} terms - List of terms to be removed.
   * @param {string} annotation - Existing element annotation.
   * @returns {string} - Updated annotation or an empty string if all items are removed.
   */
  deleteAnnotation(terms, annotation) {
    const annotationDict = this.divideExistingAnnotation(annotation);

    if (!annotationDict) {
      return annotation;
    }

    const { container, items } = annotationDict;

    const remainingItems = items.filter((val) =>
      terms.every((term) => !val.includes(term))
    );

    if (remainingItems.length > 0) {
      return this.insertList(container, remainingItems).join("\n");
    }

    return "";
  }
}

export default AnnotationMaker;
