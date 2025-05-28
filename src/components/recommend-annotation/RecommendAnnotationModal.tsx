import React, { useState, useEffect, useRef } from "react";
import "./RecommendAnnotationModal.css";

import { MyDB } from "../../App";
import {
  createRecommender,
  predictSpecies,
  predictReactions,
  createRecommendationTable,
} from "../../libs/AMAS-js/src/recommend_annotation";

import { openDB, IDBPDatabase } from "idb";
import { PreferenceTypes } from "../../App";

/**
 * Represents the Match Score Selection Criteria (MSSC) used in AMAS.
 * Determines how AMAS selects candidates based on computed match scores:
 * - `TOP`: Recommends candidates with the highest match score at or above the cutoff (Default).
 * - `ABOVE`: Recommends all candidates with a match score at or above the cutoff.
 */
enum MSSC {
  TOP = "top",
  ABOVE = "above",
}

// Annotator Info Interface
interface AnnotatorInfo {
  id: string;
  name: string;
  description: string;
  version: string;
  sourceCode: string;
}

// Annotator Info Dictionary
const annotators: AnnotatorInfo[] = [
  { id: "amas", name: "AMAS", description: "Placeholder", version: "1.0", sourceCode: "https://github.com/sys-bio/AMAS" },
  { id: "example", name: "Example", description: "An example alternative algorithm", version: "1.2.3.4 beta", sourceCode: "https://sys-bio.github.io/AntimonyEditor/" }
];

interface Recommendation {
  type: string;
  id: string;
  displayName: string;
  metaId: string;
  annotation: string;
  annotationLabel: string;
  matchScore: number;
  existing: number;
  updateAnnotation: string;
  isLowMatch: boolean;
}

// Available Annotators
enum Annotators {
  AMAS = "amas",
  EXAMPLE = "example"
}

enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

interface SortConfig {
  field: keyof Recommendation | null;
  order: SortOrder;
}

/**
 * @description RecommendAnnotationModalProps interface
 * @interface
 * @property {IDBPDatabase<MyDB> | null | undefined} db - The database
 * @property {function} setDb - Set the database
 * @property {function} onClose - Function to close the modal
 * @property {string} fileName - The name of the current selected file
 * @property {string} fileContent - The contents of the current selected file
 * @property {function} setFileContent - Sets the file content
 * @property {function} setUploadedFiles - Sets the uploaded files
 * @property {boolean} isConverted - True if the fileContent was previously Antimony (.ant) and converted to SBML (.xml).
 * @property {dict} preferences - A stateful object that contains the user's AWE preferences
 * @property {function} handlePreferenceUpdate - A function used to update and save the user's AWE preferences
 */
interface RecommendAnnotationModalProps {
  db: IDBPDatabase<MyDB> | null | undefined;
  setDb: (database: IDBPDatabase<MyDB> | null) => void;
  onClose: () => void;
  fileName: string;
  fileContent: string;
  setFileContent: (fileContent: string) => void;
  setUploadedFiles: (files: { name: string; content: string }[]) => void;
  isConverted: boolean;
  preferences: {[key:string]: any};
  handlePreferenceUpdate: (preferences: {[key: string]: any}) => void;
}

/**
 * @description RecommendAnnotationModal component
 * @param db - RecommendAnnotationModalProp
 * @param setDb - RecommendAnnotationModalProp
 * @param onClose - RecommendAnnotationModalProp
 * @param fileName - RecommendAnnotationModalProp
 * @param fileContent - RecommendAnnotationModalProp
 * @param setFileContent - RecommendAnnotationModalProp
 * @param setUploadedFiles - RecommendAnnotationModalProp
 * @param isConverted - RecommendAnnotationModalProp
 * @param preferences - A stateful object that contains the user's AWE preferences
 * @param handlePreferenceUpdate - A function used to update and save the user's AWE preferences
 * @example - <RecommendAnnotationModal
 *              db={db}
 *              setDb={setDb}
 *              onClose={onClose}
 *              fileName={fileName}
 *              fileContent={fileContent}
 *              setFileContent={setFileContent}
 *              setUploadedFile={setUploadedFiles}
 *              isConverted={isConverted}
 *            />
 * @returns - RecommendAnnotationModalProps component
 */
const RecommendAnnotationModal: React.FC<RecommendAnnotationModalProps> = ({
  db,
  setDb,
  onClose,
  fileName,
  fileContent,
  setFileContent,
  setUploadedFiles,
  isConverted,
  preferences,
  handlePreferenceUpdate
}) => {
  const [step, setStep] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>("Loading...");
  const [recommender, setRecommender] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedRecommendations, setSelectedRecommendations] = useState<
    Record<string, boolean>
  >({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: null,
    order: SortOrder.ASC,
  });
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedAnnotator, setSelectedAnnotator] = useState<string>("amas");
  const [unsavedPreferences, setUnsavedPreferences] = useState<{[key:string]: any}>(JSON.parse(JSON.stringify(preferences[PreferenceTypes.ANNOTATOR])));
  const [isUnsaved, setIsUnsaved] = useState<boolean>(false);
  const [savePromptVisible, setSavePromptVisible] = useState<boolean>(false);
  const [genInProgress, setGenInProgress] = useState<boolean>(false);

  // Method to call after saving or cancelling the save prompt
  const afterSaveAction = useRef<() => void>();

  // Initialize states, mostly for debugging
  useEffect(() => {
    setIsUnsaved(false)
    afterSaveAction.current = () => {};
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !savePromptVisible &&
        !genInProgress
      ) {
        if (isUnsaved) {
          setSavePromptVisible(true);
          afterSaveAction.current = onClose;
        } else {
          onClose(); // Close the modal if the click is outside the modal
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, isUnsaved, savePromptVisible, genInProgress]);

  /**
   * Handles the generation of annotation recommendations.
   * This involves creating a recommender model, predicting species and reactions,
   * and generating a recommendation table, while updating the progress at each step.
   */
  const handleGenerateAnnotations = async () => {
    try {
      setStep(2);
      setGenInProgress(true);
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });

      const recom = await createRecommender({
        file: fileContent,
        fileName: fileName,
      });
      const numSpecies = recom.getSpeciesIDs().length;
      const numReactions = recom.getReactionIDs().length;

      setRecommender(recom);
      setProgressMessage(`Predicting ${numSpecies} species...`);
      setProgress(0.25);
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });

      // Predict species
      const predSpec = await predictSpecies({
        recom,
        cutoff: unsavedPreferences[Annotators.AMAS]["cutoff"],
        mssc: unsavedPreferences[Annotators.AMAS]["mssc"]
      });

      setProgressMessage(`Predicting ${numReactions} reactions...`);
      setProgress(0.5);
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });

      // Predict reactions
      const predReac = await predictReactions({
        recom,
        cutoff: unsavedPreferences[Annotators.AMAS]["cutoff"],
        mssc: unsavedPreferences[Annotators.AMAS]["mssc"]
      });

      setProgressMessage("Creating recommendations table...");
      setProgress(0.75);
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });

      // Generate recommendations table
      const recomTable = await createRecommendationTable({
        recom,
        predSpec,
        predReac,
      });

      setProgress(100);
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });

      // Determine low matches
      const groupedRecommendations = recomTable.reduce(
        (groups: Record<string, Recommendation[]>, rec: Recommendation) => {
          if (!groups[rec.id]) {
            groups[rec.id] = [];
          }
          groups[rec.id].push(rec);
          return groups;
        },
        {}
      );

      const checkLowMatch = (group: Recommendation[]): Recommendation[] => {
        const existingZeros = group.filter((rec) => rec.existing === 0);

        return group.map((rec) => {
          if (rec.existing === 1) {
            const hasLowMatch = existingZeros.some(
              (existingZero) => rec.matchScore < existingZero.matchScore
            );
            return { ...rec, isLowMatch: hasLowMatch };
          }
          return rec;
        });
      };

      const processedRecommendations = recomTable.map((rec: Recommendation) => {
        const group = groupedRecommendations[rec.id];
        const checkedGroup = checkLowMatch(group);
        const updatedRec = checkedGroup.find(
          (r) => getRecommendationKey(r) === getRecommendationKey(rec)
        );
        return { ...rec, isLowMatch: updatedRec?.isLowMatch || false };
      });

      setRecommendations(processedRecommendations);
      setSelectedRecommendations(
        recomTable.reduce(
          (acc: Record<string, boolean>, rec: Recommendation) => {
            const key = getRecommendationKey(rec);
            acc[key] = rec.existing === 1;
            return acc;
          },
          {} as Record<string, boolean>
        )
      );
      setStep(3);
      setGenInProgress(false);
    } catch (error) {
      console.error("Unable to generate annotation recommendations:", error);
      setGenInProgress(false);
      onClose();
    }
  };

  /**
   * Generates a unique key for a recommendation using its ID and annotation.
   * This ensures selections remain stable even when sorting or filtering the list.
   *
   * @param rec - The recommendation object.
   * @returns A string key in the format "id-annotation".
   */
  const getRecommendationKey = (rec: Recommendation) =>
    `${rec.id}-${rec.annotation}`;

  /**
   * Toggles the selection of a recommendation by its recommendation key generated by getRecommendationKey.
   * If the recommendation is already selected, it will be deselected, and vice versa.
   */
  const handleSelect = (key: string) => {
    setSelectedRecommendations((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /**
   * Updates the sorting configuration based on the selected field.
   * Toggles between ascending and descending order if the same field is clicked.
   *
   * @param field - The recommendation field to sort by.
   */
  const handleSort = (field: keyof Recommendation) => {
    setSortConfig((prev) => ({
      field,
      order:
        prev.field === field && prev.order === SortOrder.ASC
          ? SortOrder.DESC
          : SortOrder.ASC,
    }));
  };

  /**
   * Sort recommendations based on the sort config.
   */
  const sortedRecommendations =
    sortConfig.field !== null
      ? [...recommendations].sort((a, b) => {
        const field = sortConfig.field as keyof typeof a;
        const valueA = a[field];
        const valueB = b[field];
        if (typeof valueA === "number" && typeof valueB === "number") {
          return sortConfig.order === SortOrder.ASC
            ? valueA - valueB
            : valueB - valueA;
        } else if (typeof valueA === "string" && typeof valueB === "string") {
          return sortConfig.order === SortOrder.ASC
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
        return 0;
      })
      : recommendations;

  /**
   * Updates the file with selected annotations by generating an SBML document.
   * Converts it to Antimony if needed.
   */
  const handleUpdateAnnotations = async () => {
    try {
      if (recommender) {
        const selected = recommendations.filter(
          (rec) => selectedRecommendations[getRecommendationKey(rec)]
        );

        const updatedSBMLString = recommender.getSBMLDocument({
          sbmlDocument: recommender.sbmlDocument,
          chosen: selected,
          autoFeedback: true,
        });

        // Update AWE
        let updatedContent;
        if (isConverted) {
          // Convert to Antimony if needed
          if (window.convertSBMLToAntimony) {
            updatedContent = await window.convertSBMLToAntimony(
              updatedSBMLString
            );
            window.antimonyString = updatedContent;
          } else {
            console.error(
              "convertSBMLToAntimony function not found in the global scope."
            );
            return;
          }
        } else {
          updatedContent = updatedSBMLString;
          window.sbmlString = updatedContent;
        }

        setFileContent(updatedContent);
        window.localStorage.setItem("current_file", updatedContent);
        if (db) {
          const updatedFile = { name: fileName, content: updatedContent };
          await db.put("files", updatedFile);
          const updatedFiles = await db.getAll("files");
          const updatedDatabase = await openDB<MyDB>("antimony_editor_db", 1);
          setUploadedFiles(updatedFiles);
          setDb(updatedDatabase);
        }
      }
    } catch (error) {
      console.error("Unable to update annotations:", error);
    } finally {
      onClose();
    }
  };

  /**
   * 
   * Function to call to update the "unsaved preferences".
   * Also updates the unsaved state to cause the save prompt to show up
   * if any settings are different
   * 
   * @param annotator - Annotator's preference to update
   * @param key - name of the preference
   * @param value - value of the preference
   */
  const updateUnsavedPreferences = (annotator: Annotators, key:string, value:any) => {
    //console.log("updating " + key + " to " + value)
    let temp = unsavedPreferences;
    temp[annotator][key] = value;
    setIsUnsaved(JSON.stringify(preferences[PreferenceTypes.ANNOTATOR]) !== JSON.stringify(temp));
    setUnsavedPreferences(temp);
  }

  const handleSavePreferences = () => {
    let temp = JSON.parse(JSON.stringify(preferences));
    temp[PreferenceTypes.ANNOTATOR] = unsavedPreferences
    handlePreferenceUpdate(JSON.parse(JSON.stringify(temp)));
    setIsUnsaved(false);
    setSavePromptVisible(false);
    if (afterSaveAction) {
      let a = afterSaveAction.current;
      afterSaveAction.current = () => {};
      if (a)
        a();
    }
  }

  const handleCancelSavePreferences = () => {
    setIsUnsaved(false);
    setSavePromptVisible(false);
    setUnsavedPreferences(JSON.parse(JSON.stringify(preferences[PreferenceTypes.ANNOTATOR])));
    if (afterSaveAction) {
      let action = afterSaveAction.current;
      afterSaveAction.current = () => {};
      if (action)
        action();
    }
  }

  const annotatorIDtoForm: {[key:string]: any}= {
    "amas": AMASForm(unsavedPreferences, updateUnsavedPreferences),
    "example": ExampleForm(unsavedPreferences, updateUnsavedPreferences)
  }

  return (
    <>
      <div className="shadow-background" />
      {savePromptVisible && 
      <div className="save-prompt-background">
        <div className="save-prompt-container">
          <div className="modal-title-container">
            <div className="modal-title"> Unsaved Changes </div>
          </div>
          <div className="save-prompt">
            Do you want to save your preferences?
          </div>
          <div className="save-prompt-buttons">
            <div className="save-prompt-button"
            onClick={(e) => handleSavePreferences()}>
              Save
            </div> 
            <div className="save-prompt-button"
            onClick={() => handleCancelSavePreferences()}>
              No
            </div>
          </div>   
        </div>
      </div>
      }
      <div
        className="annot-modal"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-title-container">
          <div className="modal-title">
            {step === 1 && `Select Arguments`}
            {step === 2 && (
              <div>
                <div>{progressMessage}</div>
                <progress value={progress} />
              </div>
            )}
            {step === 3 && `Select annotations to update`}
          </div>
        </div>

        {step === 1 && (
          <>
            <div className="annot-arguments-container">
              <div className="select-annotator-container">
                Selected Annotator:
                <select
                  className="select-annotator"
                  value={selectedAnnotator}
                  onChange={e => {
                    setSelectedAnnotator(e.target.value);
                    if (isUnsaved) {
                      setSavePromptVisible(true)
                    }
                  }}
                >
                  {annotators.map((a) => (
                    <option className="select-options" value={a.id} key={a.id}>{a.name}</option>
                  ))
                  }
                </select>
              </div>
              
              {annotatorIDtoForm[selectedAnnotator]}
            </div>
            {selectedAnnotator === Annotators.AMAS ? <div 
              tabIndex={0}
              className= "annot-recommend-button"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (isUnsaved) {
                    setSavePromptVisible(true)
                  } else {
                    handleGenerateAnnotations()
                  }
                }
              }}
              onClick={() => {
                if (isUnsaved) {
                  setSavePromptVisible(true)
                } else {
                  handleGenerateAnnotations()
                }
              }}
            >
              Generate annotation recommendations
            </div>:
            <div className= "annot-recommend-button-grey">
              Annotation Recommendation Not Available
            </div>
            }
          </>
        )}

        {step === 3 && (
          <>
            <div className="annot-grid">
              <div className="annot-grid-header-container">
                <div
                  className="annot-grid-header sortable-header"
                  onClick={() => handleSort("type")}
                >
                  <div>Type</div>
                  <div>
                    {sortConfig.field === "type"
                      ? sortConfig.order === SortOrder.ASC
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </div>
                </div>
                <div className="annot-grid-header">ID</div>
                <div className="annot-grid-header">Display Name</div>
                <div className="annot-grid-header">Annotation</div>
                <div className="annot-grid-header">Annotation Label</div>
                <div
                  className="annot-grid-header sortable-header"
                  onClick={() => handleSort("matchScore")}
                >
                  <div>Match Score</div>
                  <div>
                    {sortConfig.field === "matchScore"
                      ? sortConfig.order === SortOrder.ASC
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </div>
                </div>
                <div className="annot-grid-header">Selected Annotation</div>
              </div>

              {sortedRecommendations.map((rec) => {
                const key = getRecommendationKey(rec);
                return (
                  <div
                    className={`annot-grid-row ${rec.isLowMatch && "low-match"
                      }`}
                    key={key}
                  >
                    <div className="annot-grid-item">{rec.type}</div>
                    <div className="annot-grid-item">{rec.id}</div>
                    <div className="annot-grid-item">{rec.displayName}</div>
                    <div className="annot-grid-item">{rec.annotation}</div>
                    <div className="annot-grid-item">{rec.annotationLabel}</div>
                    <div className="annot-grid-item">{rec.matchScore}</div>
                    <div className="annot-grid-item">
                      <input
                        type="checkbox"
                        checked={selectedRecommendations[key] || false}
                        onChange={() => handleSelect(key)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              className="annot-recommend-button"
              onClick={handleUpdateAnnotations}
            >
              Update annotations
            </div>
          </>
        )}
      </div>
    </>
  );
};

export const DefaultFormPreferences:{[key:string]: any} = {
  "amas": {
    "cutoff" : 0.1,
    "mssc" : "TOP"
  },
  "example": {
    "one": "Example String",
    "two": 0,
    "three": 0,
    "four": "Select1",
  },
}

// The preference form for AMAS
const AMASForm = (unsavedPreferences:{[key:string]: any}, updateUnsavedPreferences: (annotator: Annotators, key:string, value:any) => void) => {

  const [mssc, updateMssc] = useState<MSSC>(unsavedPreferences[Annotators.AMAS]["mssc"] as MSSC);
  const [cutoff, updateCutoff] = useState<number>(unsavedPreferences[Annotators.AMAS]["cutoff"])

  /**
   * Handles changes to the cutoff value input field.
   * Ensures the value stays within the valid range of 0.0 to 1.0.
   *
   * @param event - The change event from the number input field.
   */
  const handleCutoff = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseFloat(event.target.value);
    if (value >= 0.0 && value <= 1.0) {
      updateUnsavedPreferences(Annotators.AMAS, "cutoff", value);
      updateCutoff(value)
    }
  };

  /**
   * Handles changes to the MSSC dropdown selection.
   *
   * @param event - The change event from the dropdown select element.
   */
  const handleMSSC = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateUnsavedPreferences(Annotators.AMAS, "mssc", event.target.value);
    updateMssc(event.target.value as MSSC)
  };

  return (
    <>
      <div className="annot-argument-container">
        <label htmlFor="cutoffInput">Cutoff Score (0.0 - 1.0):</label>
        <input
          id="cutoffInput"
          type="number"
          value={cutoff}
          onChange={handleCutoff}
          min="0.0"
          max="1.0"
          step="0.01"
        />
      </div>
      <div className="annot-argument-container">
        <label htmlFor="msscInput">
          Match Score Selection Criteria (MSSC):
        </label>
        <select 
          id="msscInput" value={mssc} onChange={handleMSSC}>
          {Object.values(MSSC).map((value) => (
            <option key={value} value={value}>
              {value.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

// An example form to play around with
// When adding properties, you will need to 
// update the default preferences above
const ExampleForm = (unsavedPreferences:{[key:string]: any}, updateUnsavedPreferences: (annotator: Annotators, key:string, value:any) => void) => {

  enum SelectValues {
    Select1 = "Select1",
    Select2 = "Select2",
    Select3 = "Select3"
  }

  const [one, setOne] = useState<string>(unsavedPreferences[Annotators.EXAMPLE]["one"]);
  const [two, setTwo] = useState<number>(unsavedPreferences[Annotators.EXAMPLE]["two"]);
  const [three, setThree] = useState<number>(unsavedPreferences[Annotators.EXAMPLE]["three"]);
  const [four, setFour] = useState<SelectValues>(unsavedPreferences[Annotators.EXAMPLE]["four"] as SelectValues);

  return (
    <>
      <div className="annot-argument-container">
        <label htmlFor="ExampleInput1"> Example Input String </label>
        <input
          id = "ExampleInput1"
          type= "string"
          value = {one}
          onChange = {(e) => {
            updateUnsavedPreferences(Annotators.EXAMPLE, "one", e.target.value);
            setOne(e.target.value);
          }
          }
        />
      </div>
      <div className="annot-argument-container">
        <label htmlFor="ExampleInput2"> Example Input Number </label>
        <input
          id = "ExampleInput2"
          type= "number"
          value = {two}
          onChange = {(e) => {
            updateUnsavedPreferences(Annotators.EXAMPLE, "two", e.target.value);
            setTwo(parseInt(e.target.value));
          }
          }
        />
      </div>
      <div className="annot-argument-container">
        <label htmlFor="ExampleInput3"> Example Input Range </label>
        <div className="slider-container">
          <div className="slider-number">{three}</div>
          <input
          id = "ExampleInput3"
          type= "range"
          value = {three}
          min = "0"
          max = "100"
          step = "1"
          onChange = {(e) => {
            updateUnsavedPreferences(Annotators.EXAMPLE, "three", e.target.value);
            setThree(parseInt(e.target.value));
          }
          }
          />
        </div>
        
      </div>
      <div className="annot-argument-container">
        <label htmlFor="ExampleInput4"> Example Input Selector </label>
        <select 
          id="ExampleInput4" 
          value={four} 
          onChange={(e) => {
            updateUnsavedPreferences(Annotators.EXAMPLE, "four", e.target.value);
            setFour(e.target.value as SelectValues);
          }
        }>
          {Object.values(SelectValues).map((value) => (
            <option key={value} value={value}>
              {value.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

export default RecommendAnnotationModal;
