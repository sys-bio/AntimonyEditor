import React, { useEffect, useState, useMemo, useRef } from "react";
import "./CreateAnnotationModal.css";
import * as monaco from "monaco-editor";

import { getChebi, getUniProt, getRhea, getOntology } from "../../features/AnnotationSearch";
import { SrcPosition } from "../../language-handler/Types";

/**
 * @description CreateAnnotationModal interface
 * @interface
 * @property {function} onClose - Function to close the modal
 * @property {} annotationAddPosition - SrcPosition where the new annotation is to be added
 * @property {} editorInstance - Monaco editor instance to add annotation to
 * @property {} varToAnnotate - id and name of the var being annotated.
 */
interface CreateAnnotationModalProps {
  onClose: () => void;
  annotationAddPosition: SrcPosition | null;
  editorInstance: monaco.editor.IStandaloneCodeEditor | null;
  varToAnnotate: VarToAnnotate | null;
}

type VarToAnnotate = {
  id: string;
  name: string | undefined;
};

/**
 * @description Holds relevant information for a single annotation search result
 * @interface
 * @property {string} name - The name of the annotation
 * @property {string} id - The id of the annotation
 * @property {string} detail - A description of the annotation
 * @property {function} link -  The link that will appear for the annotation
 */
interface AnnotationInfo {
  name: string;
  id: string;
  description: string;
  link?: string;
  ec?: string[];
  organism?: { scientificName: string; commonName: string };
}

/**
 * @description Holds relevant information for a single database to query from
 * @interface
 * @property {string} label - The label of the database item
 * @property {string} id - The id of the database item
 * @property {string} detail - The detail of what the database item is commonly used for
 * @property {function} searchFunction - The function used to query the database
 */
interface Database {
  label: string;
  id: string;
  detail: string;
  searchFunction: (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSearchResults: React.Dispatch<React.SetStateAction<AnnotationInfo[]>>,
    ref: React.RefObject<HTMLInputElement>,
    ontologyId?: string
  ) => void;
}

/**
 * @description The databases to query from
 */
const databases: Database[] = [
  {
    label: "ChEBI",
    id: "chebi",
    detail: "Species",
    searchFunction: getChebi,
  },
  {
    label: "UniProt",
    id: "uniprot",
    detail: "Species",
    searchFunction: getUniProt,
  },
  {
    label: "RHEA",
    id: "rhea",
    detail: "Reactions",
    searchFunction: getRhea,
  },
  {
    label: "Gene Ontology",
    id: "go",
    detail: "Compartments, Reactions",
    searchFunction: getOntology,
  },
  {
    label: "Cell Type Ontology",
    id: "cl",
    detail: "Compartments",
    searchFunction: getOntology,
  },
  {
    label: "Protein Ontology",
    id: "pr",
    detail: "Species",
    searchFunction: getOntology,
  },
  {
    label: "Ontology for Biomedical Investigations",
    id: "obi",
    detail: "Compartments",
    searchFunction: getOntology,
  },
  {
    label: "Foundational Model of Anatomy",
    id: "fma",
    detail: "Compartments",
    searchFunction: getOntology,
  },
  {
    label: "Mouse Adult Gross Anatomy",
    id: "ma",
    detail: " Compartments",
    searchFunction: getOntology,
  },
];

const TOTAL_STEPS = 2;

/**
 * @description CreateAnnotationModal component
 * @param onClose - CreateAnnotationModalProps
 * @example - <CreateAnnotationModal onClose={closeModal} />
 * @returns - CreateAnnotationModal component
 */
const CreateAnnotationModal: React.FC<CreateAnnotationModalProps> = ({
  onClose,
  annotationAddPosition,
  editorInstance,
  varToAnnotate,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [chosenDatabase, setChosenDatabase] = useState<Database | null>(null);
  const [databaseSearchResults, setDatabaseSearchResults] = useState<Database[]>(databases);
  const [annotationSearchResults, setAnnotationSearchResults] = useState<AnnotationInfo[]>([]);

  const modalRef = useRef<HTMLDivElement>(null);
  const chebiRef = useRef<HTMLInputElement>(null);
  const uniprotRef = useRef<HTMLInputElement>(null);
  const rheaRef = useRef<HTMLInputElement>(null);
  const goRef = useRef<HTMLInputElement>(null);
  const clRef = useRef<HTMLInputElement>(null);
  const prRef = useRef<HTMLInputElement>(null);
  const obiRef = useRef<HTMLInputElement>(null);
  const fmaRef = useRef<HTMLInputElement>(null);
  const maRef = useRef<HTMLInputElement>(null);

  const refs: { [key: string]: React.RefObject<HTMLInputElement> } = useMemo(
    () => ({
      chebi: chebiRef,
      uniprot: uniprotRef,
      rhea: rheaRef,
      go: goRef,
      cl: clRef,
      pr: prRef,
      obi: obiRef,
      fma: fmaRef,
      ma: maRef,
    }),
    []
  );

  /**
   * @description Initialize each searchbar with their search function
   */
  useEffect(() => {
    if (step === 2 && chosenDatabase) {
      chosenDatabase.searchFunction(
        setLoading,
        setAnnotationSearchResults,
        refs[chosenDatabase.id],
        chosenDatabase.id
      );
    }
  }, [step, chosenDatabase, refs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose(); // Close the modal if the click is outside the modal
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  /**
   * @description Handle search input change, looks for matches on database name, as well as
   * the type of variable the database is commonly used for, eg: species, compartments, reactions, etc.
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (step === 1) {
      const filtered = databases.filter(
        (database) =>
          database.label.toLowerCase().includes(event.target.value.toLowerCase()) ||
          database.detail.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setDatabaseSearchResults(filtered);
    }
  };

  /**
   * Handles the case where for annotation a data base has been selected
   * Here we want to be able to start querying the chosen database. 
   * @description Handle selecting a database
   */
  const handleSelectDatabase = (database: Database) => {
    let autoPopulate = databaseSearchAutoPopulatedTerm(varToAnnotate);

    setStep(2);
    setSearchTerm(autoPopulate);
    setChosenDatabase(database);
    setAnnotationSearchResults([]);
  };

  /**
   * handles getting the string that will autopopulate a database search bar
   * 
   * The logic is as follows:
   * 
   * Every variable has an ID, and also may have an actual 'name' string assigned to it. 
   * We prioritize this 'name' if it exists as it is typically more descriptive of the variable itself.
   * If no 'name' exists, we use the ID. 
   * 
   * In both cases, to make this initial search string friendlier to the database search engine we replace
   * all '_' with ' '. 
   * 
   * @param varToAnnotate target of annotation search
   * @returns the string with which to populate the data base search bar.
   */
  const databaseSearchAutoPopulatedTerm = (varToAnnotate: VarToAnnotate | null) => {
    let autoPopulate = "";
    if (varToAnnotate) {
      if (varToAnnotate && varToAnnotate.name) {
        autoPopulate = varToAnnotate.name.replaceAll('_',' ');
      } else {
        autoPopulate = varToAnnotate.id.replaceAll('_',' ');
      }
    }
    return autoPopulate;
  }

  /**
   * @description Reset to Step 1
   */
  const handleBack = () => {
    setStep(1);
    setSearchTerm("");
    setChosenDatabase(null);
    setDatabaseSearchResults(databases);
  };

  /**
   * @description Create an annotation in the editor when an annotation is selected
   */
  const handleCreateAnnotation = (annotation: AnnotationInfo) => {
    onClose();
    let line = 0;
    let col = 0;
    if (annotationAddPosition) {
      line = annotationAddPosition.line;
      col = annotationAddPosition.column;
    }

    // this adds indentation for when annotation should be within a model
    // if there is indentation, it should always be based on
    // the preset indentation level of the editor (2 spaces I think?)
    let spaces = "";
    for (let i = 0; i < col; i++) {
      spaces += " ";
    }

    // total number of lines in the editor currently
    let lineCount: number | undefined = editorInstance?.getModel()?.getLineCount();

    // setup the edits/operations the editor should perform.
    let comment = "//" + annotation.name;
    let text = spaces + varToAnnotate?.id + ' identity "' + annotation.link + "\";" + comment;
    let selection = new monaco.Range(line, 0, line, 0);
    let id = { major: 1, minor: 1 };
    let op = { identifier: id, range: selection, text: text, forceMoveMarkers: true };

    if (lineCount && line > lineCount) {
      // line to insert is more than existing lines in editor
      // so need to prepend a new line
      op.text = "\n" + op.text;
    } else {
      // new line already exists, append a
      // newline so that inserting into
      // a model defined within the file works.
      op.text = op.text + "\n";
    }

    // perform the editor update.
    editorInstance?.executeEdits("my-source", [op]);
    editorInstance?.revealLineInCenter(line);
    // make sure the added line is selected.
    editorInstance?.setSelection(
      new monaco.Range(
        line,
        spaces.length + 1,
        line,
        text.length - spaces.length - comment.length + 2
      )
    );
  };

  /**
   * @description Takes care of showing EC number and associated link for a rhea search
   * @param annotation
   * @returns html holding EC number and link if EC numbers exist.
   */
  const handleRheaSearchResults = (annotation: AnnotationInfo) => {
    if (annotation.ec && annotation.ec.length > 1) {
      let len = annotation.ec.length;
      return (
        <span className="annotationEC">
          {annotation.ec.map((ec, index) => (
            <span>
              EC:
              <a
                className="ecLink"
                href={"https://enzyme.expasy.org/EC/" + ec}
                target="_blank"
                rel="noopener noreferrer"
              >
                {ec}
              </a>
              {annotation.ec && len > 1 && index < len - 1 && ", "}
            </span>
          ))}
        </span>
      );
    }
  };

  /**
   * Takes care of showing the organism scientific and commonName
   * @param annotation
   * @returns
   */
  const handleUniProtSearchResults = (annotation: AnnotationInfo) => {
    if (annotation.organism) {
      return (
        <span className="annotationEC">
          Organism: {annotation.organism.scientificName}
          {annotation.organism.commonName && " (" + annotation.organism.commonName + ")"}
        </span>
      );
    }
  };

  return (
    <div className="annot-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
      <div className="modal-title-container">
        {step === 2 && (
          <button className="back-button" onClick={handleBack}>
            Back
          </button>
        )}
        <div className="modal-title">
          {step === 2 && `${chosenDatabase?.label} (${step}/${TOTAL_STEPS})`}
          {step === 1 && `Create Annotation (${step}/${TOTAL_STEPS})`}
        </div>
        {step === 2 && <div className="filler" />}
      </div>

      {step === 1 && (
        <input
          id="annot-browse"
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Pick a database to query"
        />
      )}

      {step === 2 && chosenDatabase && (
        <input
          id="annot-browse"
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Enter query"
          ref={refs[chosenDatabase.id]}
        />
      )}

      <ul className="annot-results">
        {loading ? (
          <li className="loading">Loading...</li>
        ) : step === 1 ? (
          databaseSearchResults.map((database: Database) => (
            <li key={database.id} onClick={() => handleSelectDatabase(database)}>
              {database.label}
              <div className="database-detail">{database.detail}</div>
            </li>
          ))
        ) : (
          annotationSearchResults.map((annotation: AnnotationInfo) => (
            <li
              key={annotation.id}
              className={annotation.id}
              onClick={(e) =>
                annotation.id === "unable-to-retrieve" || annotation.id === "no-results-found"
                  ? e.preventDefault()
                  : handleCreateAnnotation(annotation)
              }
            >
              <span className="annotationName">{annotation.name}</span>
              <span className="annotationDescription">{annotation.description}</span>
              {handleRheaSearchResults(annotation)}
              {handleUniProtSearchResults(annotation)}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default CreateAnnotationModal;
