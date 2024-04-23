import React, { useEffect, useState } from 'react';
import './CreateAnnotationModal.css';

/**
 * @description CreateAnnotationModal interface
 * @interface
 * @property {function} onClose - Function to close the modal
 */
interface CreateAnnotationModalProps {
  onClose: () => void;
}

/**
 * @description Database interface
 * @interface
 * @property {string} label - The label of the database item
 * @property {string} id - The id of the database item
 */
interface Database {
  label: string;
  id: string;
}

const databases: Database[] = [
  { label: 'ChEBI', id: 'chebi'},
  { label: 'UniProt', id: 'uniprot'},
  { label: 'RHEA', id: 'rhea'},
  { label: 'Gene Ontology', id: 'gontology'},
  { label: 'Cell Type Ontology', id: 'contology'},
  { label: 'Protein Ontology', id: 'pontology'},
  { label: 'Ontology for Biomedical Investigations', id: 'bontology'},
  { label: 'Foundational Model of Anatomy', id: 'fontology'},
  { label: 'Mouse Adult Gross Anatomy', id: 'montology'},
];

/**
 * @description CreateAnnotationModal component
 * @param onClose - CreateAnnotationModalProps
 * @example - <CreateAnnotationModal onClose={closeModal} />
 * @returns - CreateAnnotationModal component
 */
const CreateAnnotationModal: React.FC<CreateAnnotationModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredDatabases, setFilteredDatabases] = useState<Database[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<Database | null>(null);

  /**
   * @description Initialize filtered databases with all databases
   */
  useEffect(() => {
    setFilteredDatabases(databases);
  }, []);

  /**
   * @description Handle database search input change
   */
  const handleDatabaseSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    const filtered = databases.filter(database =>
      database.label.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredDatabases(filtered);
  };

  /**
   * @description Handle selecting a database from the list
   */
  const handleSelectDatabase = (database: Database) => {
    setSearchTerm('');
    setSelectedDatabase(database);
    setStep(2);
  };

  /**
   * @description Handle query search input change
   */
  const handleQuerySearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // close modal
  };

  /**
   * @description Handle going back to step 1
   */
  const handleBack = () => {
    setSearchTerm('');
    setSelectedDatabase(null);
    setStep(1);
  };

  /**
   * @description Handle closing the modal
   */
  const handleCloseModal = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className='modal-title-container'>
        {step === 2 && (
          <button className='back-button' onClick={handleBack}>Back</button>
        )}
        <div className='modal-title'>{step === 1 ? 'Create Annotation (1/2)' : 'Create Annotation (2/2)'}</div>
        {step === 2 && (
          <div className='filler' />
        )}
      </div>
      
      {step === 1 ? (
        <input
          type="text"
          placeholder="Pick a database to query"
          value={searchTerm}
          onChange={handleDatabaseSearch}
          className="search-bar"
        />
      ) : (
        <input
          type="text"
          placeholder="Enter query"
          value={searchTerm}
          onChange={handleQuerySearch}
          className="search-bar"
        />
      )}

      {step === 1 ? (
        <ul className="database-list">
          {filteredDatabases.map((database) => (
            <li key={database.id} onClick={() => handleSelectDatabase(database)}>
              {database.label}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="query-list">
          {/* Insert database query results */}
        </ul>
      )}
    </div>
  );
};

export default CreateAnnotationModal;