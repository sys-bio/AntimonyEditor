import React from 'react';
const corsProxyUrl = "https://corsproxy.io/?";//"https://api.allorigins.win/raw?url=";

/**
 * @description holds relevant information for a single annotation search result
 */
type annotationInfo = {
    name: string, 
    id: string,
    description: string,
    link: string // the link that will appear for the annotation
}

/**
 * @description asynchronously searches the UniProt database 
 * @param search holds query info
 * @param size number of results to return
 * @returns {Promise<annotationInfo[] | undefined>} A promise that resolves to an array of annotationInfo objects if successful
 * otherwsie undfined.
 */
export async function searchUniProt(search: KeyboardEvent, size: number): Promise<annotationInfo[] | undefined> {
  if (size <= 0) {
    return undefined;
  }
  try {
    const queryText = (search.target as HTMLInputElement).value.trim();
    if (queryText.length === 0) {
      return undefined;
    }

    let result: annotationInfo[] | undefined = await fetch(`https://rest.uniprot.org/uniprotkb/search?fields=accession%2Creviewed%2Cid%2Cprotein_name%2Cgene_names%2Corganism_name%2Clength&query=%28${queryText}%29&size=${size}`)
      .then(response => {
        if (!response.ok) {
          return undefined;
        }

        let info: annotationInfo[] = [];
        response.json().then(data => {
          for (let i = 0; i < data.results.length; i++) {
            let curr: annotationInfo = {
              id: data.results[i].uniProtkbId,
              name: data.results[i].proteinDescription.recommendedName.fullName.value,
              description: "",
              link: "https://www.uniprot.org/uniprotkb/" + data.results[i].primaryAccession + "/entry"
            }
            info.push(curr);
          }
        })
        return info;
      });
    return result;
  } catch(error) {
    console.log(error);
    return undefined;
  }
}

/**
 * @description asynchronously searches the Ontology database 
 * @param search holds query info
 * @param ontologyId filters the ontology type, must be one of the following:
 *      cl = cell type ontology
 *      go = gene ontology
 *      pr = protein ontology
 *      obi = ontology for biomedical investigations
 *      fma = foundation model of anatomy
 *      ma = mouse adult gross anatomy
 * @param size number of results to return
 * @returns {Promise<annotationInfo[] | undefined>} A promise that resolves to an array of annotationInfo objects if successful
 * otherwsie undfined.
 */
export async function searchOntology(search: KeyboardEvent, ontologyId: string, size: number): Promise<annotationInfo[] | undefined> {
  if (size <= 0) {
    return undefined;
  }
    
  const validOngologyIds: string[] = ["cl","go","pr","obi","fma","ma"];
  if (!validOngologyIds.includes(ontologyId)) {
    return undefined;
  }

  try {
    const queryText = (search.target as HTMLInputElement).value.trim();
    if (queryText.length === 0) {
      return undefined;
    }

    let result: annotationInfo[] | undefined = await fetch(`https://www.ebi.ac.uk/ols4/api/v2/entities?search=${queryText}&size=${size}&page=0&ontologyId=${ontologyId}&lang=en&exactMatch=false&includeObsoleteEntities=false&isDefiningOntology=true`)
      .then(response => {
        if (!response.ok) {
            return undefined;
        }

        // let info: annotationInfo[] = [];
        let info: annotationInfo[] = [];
        response.json().then(data => {
          for (let i = 0; i < data.elements.length; i++) {
            if (true || (data.elements[i].type[0] === 'class' && data.elements[i].type[1] === 'entity')) {
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
              let curr: annotationInfo = {
                id: data.elements[i].curie,
                name: data.elements[i].label,
                description: descrip,
                link: data.elements[i].iri
              }
              info.push(curr);
            }
          }
        })
        return info;
      });
      return result;
  } catch(error) {
    console.log(error);
    return undefined;
  }
}

/**
 * @description asynchronously searches the Rhea database 
 * @param search holds query info
 * @param size number of results to return
 * @returns {Promise<annotationInfo[] | undefined>} A promise that resolves to an array of annotationInfo objects if successful
 * otherwsie undfined.
 */
export async function searchRhea(search: KeyboardEvent, size: number): Promise<annotationInfo[] | undefined> {
  if (size <= 0) {
    return undefined;
  } 
  try {
    const queryText = (search.target as HTMLInputElement).value.trim();
    if (queryText.length === 0) {
      return undefined;
    }

    let result: annotationInfo[] | undefined = await fetch(`https://www.rhea-db.org/rhea/?query=${queryText}&columns=rhea-id,equation&format=json&limit=${size}`)
      .then(response => {
        if (!response.ok) {
          return undefined;
        }
        let info: annotationInfo[] = [];
        response.json().then(data => {
          for (let i = 0; i < data.results.length; i++) {
            let curr: annotationInfo = {
              id: data.results[i].id,
              name: data.results[i].equation,
              description: "",
              link: "https://www.rhea-db.org/rhea/" + data.results[i].id
            }
            info.push(curr);
          }
        })
        return info;
      });
    return result;
  } catch(error) {
    console.log(error);
    return undefined;
  }
}

/**
 * @description asynchronously searches the Chebi database
 * @param search holds query info
 * @param size number of results to return
 * @returns {Promise<annotationInfo[] | undefined>} A promise that resolves to an array of annotationInfo objects if successful
 * otherwsie undfined.
 */
export async function searchChebi(search: KeyboardEvent, size: number): Promise<annotationInfo[] | undefined> {
  if (size <= 0) {
    return undefined;
  }
  try {
    const queryText = (search.target as HTMLInputElement).value.trim();
    if (queryText.length === 0) {
      return undefined;
    }

    console.log(queryText)
    let result: annotationInfo[] | undefined = await fetch(corsProxyUrl + `https://www.ebi.ac.uk/webservices/chebi/2.0/test/getLiteEntity?search=${queryText}&searchCategory=a&maximumResults=${size}&starsCategory=ALL`)
      .then(response => {
        // console.log(response)
        if (!response.ok) {
          return undefined;
        }
        const convert = require('xml-js');
        let info: annotationInfo[] = [];
        response.text().then(data => {
          let jsonStr = convert.xml2json(data, {
            compact: true,
            spaces: 2
          })
          
          let results = JSON.parse(jsonStr);
          // let chebiList = results["S:Envelope"]["S:Body"]["getLiteEntityResponse"]["return"]["ListElement"];
          let chebiList = results["S:Envelope"]["S:Body"]?.getLiteEntityResponse?.return?.ListElement;
          if (chebiList === undefined) {
            console.log(results);
            return;
          }
          for (let i = 0; i < chebiList.length; i++) {
            let curr: annotationInfo = {
              id: chebiList[i].chebiId._text,
              name: chebiList[i].chebiAsciiName._text,
              description: "",
              link: "http://identifiers.org/chebi/" + chebiList[i].chebiId._text
            }
            info.push(curr);
        }
        })
        return info;
      });
    return result;
  } catch(error) {
    console.log(error);
    return undefined;
  }
}

export function getChebi(setLoading: React.Dispatch<React.SetStateAction<boolean>>, setChosenModel: React.Dispatch<React.SetStateAction<string | null>>) {
  const chebiBrowse = document.getElementById('chebi-browse') as HTMLInputElement;
  let timer: any;
  const waitTime = 1000;

  chebiBrowse.addEventListener('keyup', async (val) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      setLoading(true);
      let chebis = await searchChebi(val, 100);
      console.log(chebis);
      setLoading(false);
    }, waitTime);
  });
}

export function getOntology(setLoading: React.Dispatch<React.SetStateAction<boolean>>, setChosenModel: React.Dispatch<React.SetStateAction<string | null>>) {
  const ontologyBrowse = document.getElementById('ontology-browse') as HTMLInputElement;
  let timer: any;
  const waitTime = 1000;

  ontologyBrowse.addEventListener('keyup', async (val) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      setLoading(true);
      // dropdown!.innerHTML = "";
      // cl = cell type ontology
      // go = gene ontology
      // pr = protein ontology
      // obi = ontology for biomedical investigations
      // fma = foundation model of anatomy
      // ma = mouse adult gross anatomy
      let ontologies = await searchOntology(val, "go", 100);
      // console.log(ontologies);
      setLoading(false);
    }, waitTime);
  });
}


export function getUniProt(setLoading: React.Dispatch<React.SetStateAction<boolean>>, setChosenModel: React.Dispatch<React.SetStateAction<string | null>>) {
  const uniBrowse = document.getElementById('uniprot-browse') as HTMLInputElement;
  let timer: any;
  const waitTime = 1000;

  uniBrowse.addEventListener('keyup', async (val) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      setLoading(true);
      let uniProts = await searchUniProt(val, 100);
      console.log(uniProts);
      setLoading(false);
    }, waitTime);
  });
}

export function getRhea(setLoading: React.Dispatch<React.SetStateAction<boolean>>, setChosenModel: React.Dispatch<React.SetStateAction<string | null>>) {
  const rheaBrowse = document.getElementById('rhea-browse') as HTMLInputElement;
  let timer: any;
  const waitTime = 1000;

  rheaBrowse.addEventListener('keyup', async (val) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      setLoading(true);
      let rheas = await searchRhea(val, 100);
      console.log(rheas);
      setLoading(false);
    }, waitTime);
  });
}