import React, { useState } from "react";
import "./CreateAnnotationModal.css";

import { getChebi, getUniProt, getRhea, getOntology } from "../../features/AnnotationSearch";

/**
 * @description CreateAnnotationModal interface
 * @interface
 * @property {function} onClose - Function to close the modal
 */
interface CreateAnnotationModalProps {
  onClose: () => void;
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
    ontologyId?: string
  ) => void;
}

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
const CreateAnnotationModal: React.FC<CreateAnnotationModalProps> = ({ onClose }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [databaseSearchResults, setDatabaseSearchResults] = useState<Database[]>(databases);
  const [annotationSearchResults, setAnnotationSearchResults] = useState<AnnotationInfo[]>([]);

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
    database.searchFunction(setLoading, setAnnotationSearchResults, database.id);
    setAnnotationSearchResults([]);
  };

  /**
   * @description Reset to Step 1
   */
  const handleBack = () => {
    setStep(1);
    setSearchTerm("");
    setDatabaseSearchResults(databases);
    setAnnotationSearchResults([]);
  };

  /**
   * @description Create an annotation in the editor when an annotation is selected
   */
  const handleCreateAnnotation = (annotation: AnnotationInfo) => {
    onClose();
    // TODO: Create annotation
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

      <input
        id="annot-browse"
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder={step === 1 ? "Pick a database to query" : "Enter query"}
      />

      <ul className="annot-results">
        {loading ? (
          <li>Loading...</li>
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
              {annotation.name}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default CreateAnnotationModal;
