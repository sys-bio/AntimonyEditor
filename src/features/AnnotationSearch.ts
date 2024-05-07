import React from "react";
const corsProxyUrl = "https://corsproxy.io/?"; // "https://api.allorigins.win/raw?url=";

/**
 * @description Holds relevant information for a single annotation search result
 */
type AnnotationInfo = {
  name: string;
  id: string;
  description: string;
  link?: string; // the link that will appear for the annotation
};

/**
 * @description Represents the inability to retrieve data from the database.
 */
const unableToRetrieve: AnnotationInfo = {
  name: "Unable to retrieve data from the database",
  id: "unable-to-retrieve",
  description: "Unable to retrieve data from the database",
};

/**
 * @description Represents when no results are found for a query.
 */
const noResultsFound: AnnotationInfo = {
  name: "No results found",
  id: "no-results-found",
  description: "No results found",
};

/**
 * @description Represents valid ontology IDs.
 */
const validOntologyIds: string[] = [
  "cl", // Cell Type Ontology
  "go", // Gene Ontology
  "pr", // Protein Ontology
  "obi", // Ontology for Biomedical Investigations
  "fma", // Foundation Model of Anatomy
  "ma", // Mouse Adult Gross Anatomy
];

/**
 * @description Asynchronously searches the ChEBI database.
 * @param search Holds query information.
 * @param size Number of results to return.
 * @returns {Promise<AnnotationInfo[] | undefined>} A promise that resolves to an array of AnnotationInfo objects if successful,
 * otherwise undefined.
 */
export async function searchChebi(
  search: KeyboardEvent,
  size: number
): Promise<AnnotationInfo[] | undefined> {
  try {
    const queryText = (search.target as HTMLInputElement).value.trim();
    if (size <= 0 || queryText.length === 0) {
      return [];
    }

    const response = await fetch(
      corsProxyUrl +
        `https://www.ebi.ac.uk/webservices/chebi/2.0/test/getLiteEntity?search=${queryText}&searchCategory=a&maximumResults=${size}&starsCategory=ALL`
    );

    if (!response.ok) {
      return undefined;
    }

    const convert = require("xml-js");
    const data = await response.text();
    let jsonStr = convert.xml2json(data, {
      compact: true,
      spaces: 2,
    });
    const results = JSON.parse(jsonStr);
    let chebiList = results["S:Envelope"]["S:Body"];

    if (chebiList["S:Fault"] !== undefined) {
      throw new Error("Unable to establish a connection to ChEBI.");
    }

    const info: AnnotationInfo[] = chebiList["getLiteEntityResponse"]["return"]["ListElement"].map(
      (result: any) => ({
        id: result.chebiId._text,
        name: result.chebiAsciiName._text,
        description: "", // TODO: Get description
        link: "http://identifiers.org/chebi/" + result.chebiId._text,
      })
    );
    return info;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

/**
 * @description Asynchronously searches the UniProt database.
 * @param search Holds query information.
 * @param size Number of results to return.
 * @returns {Promise<AnnotationInfo[] | undefined>} A promise that resolves to an array of AnnotationInfo objects if successful,
 * otherwise undefined.
 */
export async function searchUniProt(
  search: KeyboardEvent,
  size: number
): Promise<AnnotationInfo[] | undefined> {
  try {
    const queryText = (search.target as HTMLInputElement).value.trim();
    if (size <= 0 || queryText.length === 0) {
      return [];
    }

    const response = await fetch(
      `https://rest.uniprot.org/uniprotkb/search?fields=accession%2Creviewed%2Cid%2Cprotein_name%2Cgene_names%2Corganism_name%2Clength&query=%28${queryText}%29&size=${size}`
    );

    if (!response.ok) {
      return undefined;
    }

    const data = await response.json();
    const info: AnnotationInfo[] = data.results.map((result: any) => {
      return {
        id: result.uniProtkbId,
        name:
          result.proteinDescription?.recommendedName?.fullName.value ||
          result.proteinDescription?.submissionNames[0]?.fullName.value,
        description: "", // TODO: Get description
        link: "https://www.uniprot.org/uniprotkb/" + result.primaryAccession + "/entry",
      };
    });

    return info;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

/**
 * @description Asynchronously searches the Rhea database.
 * @param search Holds query information.
 * @param size Number of results to return.
 * @returns {Promise<AnnotationInfo[] | undefined>} A promise that resolves to an array of AnnotationInfo objects if successful;
 * otherwise, undefined.
 */
export async function searchRhea(
  search: KeyboardEvent,
  size: number
): Promise<AnnotationInfo[] | undefined> {
  try {
    const queryText = (search.target as HTMLInputElement).value.trim();
    if (size <= 0 || queryText.length === 0) {
      return [];
    }

    const response = await fetch(
      `https://www.rhea-db.org/rhea/?query=${queryText}&columns=rhea-id,equation&format=json&limit=${size}`
    );

    if (!response.ok) {
      return undefined;
    }

    const data = await response.json();
    let info: AnnotationInfo[] = data.results.map((result: any) => {
      return {
        id: result.id,
        name: result.equation,
        description: "", // TODO: Get description
        link: "https://www.rhea-db.org/rhea/" + result.id,
      };
    });

    return info;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

/**
 * @description Asynchronously searches the Ontology database.
 * @param search Holds query information.
 * @param size Number of results to return.
 * @param ontologyId Filters the ontology type; must be one of the following:
 *      cl = Cell Type Ontology
 *      go = Gene Ontology
 *      pr = Protein Ontology
 *      obi = Ontology for Biomedical Investigations
 *      fma = Foundation Model of Anatomy
 *      ma = Mouse Adult Gross Anatomy
 * @returns {Promise<AnnotationInfo[] | undefined>} A promise that resolves to an array of AnnotationInfo objects if successful;
 * otherwise, undefined.
 */
export async function searchOntology(
  search: KeyboardEvent,
  size: number,
  ontologyId: string
): Promise<AnnotationInfo[] | undefined> {
  try {
    const queryText = (search.target as HTMLInputElement).value.trim();
    if (size <= 0 || queryText.length === 0 || !validOntologyIds.includes(ontologyId)) {
      return [];
    }

    const response = await fetch(
      `https://www.ebi.ac.uk/ols4/api/v2/entities?search=${queryText}&size=${size}&page=0&ontologyId=${ontologyId}&lang=en&exactMatch=false&includeObsoleteEntities=false&isDefiningOntology=true`
    );

    if (!response.ok) {
      return undefined;
    }

    let info: AnnotationInfo[] = [];
    response.json().then((data) => {
      for (let i = 0; i < data.elements.length; i++) {
        if (
          true ||
          (data.elements[i].type[0] === "class" && data.elements[i].type[1] === "entity")
        ) {
          // get the description
          let descrip: string = "";
          if (typeof data.elements[i].description === "string") {
            descrip = data.elements[i].description;
          } else if (data.elements[i].definition?.value) {
            descrip = data.elements[i].definition.value;
          } else {
            if (Array.isArray(data.elements[i].definition)) {
              for (let j = 0; j < data.elements[i].definition.length; j++) {
                if (data.elements[i].definition[j].value) {
                  descrip = data.elements[i].definition[j].value;
                  break;
                }
              }
            }
          }
          // add this element to the list of results.
          let curr: AnnotationInfo = {
            id: data.elements[i].curie,
            name: data.elements[i].label,
            description: descrip,
            link: data.elements[i].iri,
          };
          info.push(curr);
        }
      }
    });

    return info;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export function getChebi(
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSearchResults: React.Dispatch<React.SetStateAction<AnnotationInfo[]>>
) {
  let timer: ReturnType<typeof setTimeout>;
  const waitTime = 1000;

  const chebiBrowse = document.getElementById("annot-browse") as HTMLInputElement;

  chebiBrowse.addEventListener("keyup", async (val) => {
    if ((val.target as HTMLInputElement).value.length < 2) {
      setSearchResults([]);
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(async () => {
      setSearchResults([]);
      setLoading(true);
      const searchResults = await searchChebi(val, 100);

      // Error: Unable to connect to ChEBI
      if (searchResults === undefined) {
        setLoading(false);
        setSearchResults([unableToRetrieve]);
        return;
      }

      // No results found in ChEBI
      if (searchResults.length === 0) {
        setLoading(false);
        setSearchResults([noResultsFound]);
        return;
      }

      // Otherwise, display results
      setLoading(false);
      setSearchResults(searchResults);
    }, waitTime);
  });
}

export function getUniProt(
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSearchResults: React.Dispatch<React.SetStateAction<AnnotationInfo[]>>
) {
  let timer: ReturnType<typeof setTimeout>;
  const waitTime = 300;

  const uniBrowse = document.getElementById("annot-browse") as HTMLInputElement;

  uniBrowse.addEventListener("keyup", async (val) => {
    if ((val.target as HTMLInputElement).value.length < 2) {
      setSearchResults([]);
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(async () => {
      setSearchResults([]);
      setLoading(true);
      const searchResults = await searchUniProt(val, 100);

      // Error: Unable to connect to UniProt
      if (searchResults === undefined) {
        setLoading(false);
        setSearchResults([unableToRetrieve]);
        return;
      }

      // No results found in UniProt
      if (searchResults.length === 0) {
        setLoading(false);
        setSearchResults([noResultsFound]);
        return;
      }

      // Otherwise, display results
      setLoading(false);
      setSearchResults(searchResults);
    }, waitTime);
  });
}

export function getRhea(
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSearchResults: React.Dispatch<React.SetStateAction<AnnotationInfo[]>>
) {
  let timer: ReturnType<typeof setTimeout>;
  const waitTime = 1000;

  const rheaBrowse = document.getElementById("annot-browse") as HTMLInputElement;

  rheaBrowse.addEventListener("keyup", async (val) => {
    if ((val.target as HTMLInputElement).value.length < 2) {
      setSearchResults([]);
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(async () => {
      setSearchResults([]);
      setLoading(true);
      const searchResults = await searchRhea(val, 100);

      // Error: Unable to connect to Rhea
      if (searchResults === undefined) {
        setLoading(false);
        setSearchResults([unableToRetrieve]);
        return;
      }

      // No results found in Rhea
      if (searchResults.length === 0) {
        setLoading(false);
        setSearchResults([noResultsFound]);
        return;
      }

      // Otherwise, display results
      setSearchResults(searchResults);
      setLoading(false);
    }, waitTime);
  });
}

export function getOntology(
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSearchResults: React.Dispatch<React.SetStateAction<AnnotationInfo[]>>,
  ontologyId?: string
) {
  let timer: ReturnType<typeof setTimeout>;
  const waitTime = 1000;

  const ontologyBrowse = document.getElementById("annot-browse") as HTMLInputElement;

  ontologyBrowse.addEventListener("keyup", async (val) => {
    if ((val.target as HTMLInputElement).value.length < 2 || ontologyId === undefined) {
      setSearchResults([]);
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(async () => {
      setSearchResults([]);
      setLoading(true);
      const searchResults = await searchOntology(val, 100, ontologyId);

      // Error: Unable to connect to ontologyId
      if (searchResults === undefined) {
        setLoading(false);
        setSearchResults([unableToRetrieve]);
        return;
      }

      // No results found in ontologyId
      if (searchResults.length === 0) {
        setLoading(false);
        setSearchResults([noResultsFound]);
        return;
      }

      // Otherwise, display results
      setLoading(false);
      setSearchResults(searchResults);
    }, waitTime);
  });
}
