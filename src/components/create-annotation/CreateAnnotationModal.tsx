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
 * @property {} varToAnnotate - id of the var being annotated.
 */
interface CreateAnnotationModalProps {
  onClose: () => void;
  annotationAddPosition: SrcPosition | null;
  editorInstance: monaco.editor.IStandaloneCodeEditor | null;
  varToAnnotate: string | null;
}

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

  /**
   * @description Handle search input change
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (step === 1) {
      const filtered = databases.filter((database) =>
        database.label.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setDatabaseSearchResults(filtered);
    }
  };

  /**
   * @description Handle selecting a database
   */
  const handleSelectDatabase = (database: Database) => {
    setStep(2);
    setSearchTerm("");
    setChosenDatabase(database);
    setAnnotationSearchResults([]);
  };

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
    let id = { major: 1, minor: 1 };
    let spaces = "";
    for (let i = 0; i < col; i++) {
      spaces += " ";
    }
    let text = spaces + varToAnnotate + ' identity "' + annotation.link + '";\n';
    let selection = new monaco.Range(line, 0, line, 0);
    let op = { identifier: id, range: selection, text: text, forceMoveMarkers: true };
    editorInstance?.executeEdits("my-source", [op]);
  };

  return (
    <div className="annot-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-title-container">
        {step === 2 && (
          <button className="back-button" onClick={handleBack}>
            Back
          </button>
        )}
        <div className="modal-title">{`Create Annotation (${step}/${TOTAL_STEPS})`}</div>
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
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default CreateAnnotationModal;
