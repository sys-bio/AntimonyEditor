import cache from "./test_cache.json";
/**
* Interface for the biomodels API response
* @interface Model
* @property {string} name - The name of the model
* @property {string} url - The URL of the model
* @property {string} id - The ID of the model
*/
interface Model {
    name: string;
    url: string;
    id: string;
}

interface CachedData {
  [key: string]: {
      name: string;
      authors: string[];
      url: string;
      model_id: string;
      title: string;
      synopsis: string;
  };
}

/**
 * Interface for models returned by the biomodels API
 * @interface Models
 * @property {Map<String, Model>} models - The models returned by the biomodels API
 */
interface Models {
    models: Map<String, Model>;
}
// API URL for redirecting to the biomodels API
const corsProxyUrl = "https://api.allorigins.win/raw?url=";

// The cache of models retrieved from a JSON file
const cachedData: CachedData = cache;

/**
 * Function to search for models using the biomodels API
 * @param {KeyboardEvent} search - The search event
 * @returns {Promise<Models>} - A promise containing the models returned by the biomodels API
 */
export async function searchModels(search: KeyboardEvent) {
    try {
        // Get the search query
        const queryText = (search.target as HTMLInputElement).value.trim();
        console.log(queryText);
        const models: Models = { models: new Map() };
        for (const id in cachedData) {
          const modelData = cachedData[id];
          if (Object.values(modelData).some(value => 
            typeof value === "string" && value.toLowerCase().includes(queryText.toLowerCase()))) {
            models.models.set(id, {
              name: modelData.name,
              url: modelData.url,
              id: modelData.model_id
            });
          }
        }
        console.log(models);
        return models;
    } catch (error) {
        // If there is an error, throw it
        console.log(error);
        throw error;
    }
}

/**
 * Function to get a model from the biomodels API
 * @param {string} modelId - The ID of the model to get
 * @returns {Promise<string>} - A promise containing the model
 */
export async function getModel(modelId: string) {
    try {
        const response = await fetch(corsProxyUrl + `https://www.ebi.ac.uk/biomodels/model/download/${modelId}?filename=${modelId}_url.xml`);
        if (response.ok) {
            const model = await response.text();
            console.log(model);
            return model;
        } else {
            throw new Error('Error when fetching biomodel');
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * Function to display the models in the dropdown
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoading - The setLoading function from the parent component
 * @param {React.Dispatch<React.SetStateAction<string | null>>} setChosenModel - The setChosenModel function from the parent component
 * @returns {void}
 */
export function getBiomodels(setLoading: React.Dispatch<React.SetStateAction<boolean>>, setChosenModel: React.Dispatch<React.SetStateAction<string | null>>) {
  const biomodelBrowse = document.getElementById('biomodel-browse') as HTMLInputElement;
  const dropdown = document.getElementById('dropdown');
  var biomodels: any;
  var chosenModel: any;

  biomodelBrowse.addEventListener('keyup', async (val) => {
    const biomodel = val;
    if ((val.target as HTMLInputElement).value.length < 2) {
      dropdown!.innerHTML = "";
      return;
    }
    setTimeout(async () => {
      setLoading(true);
      dropdown!.innerHTML = "";
      biomodels = await searchModels(biomodel);
      // If no models found, display "No models found"
      if (biomodels.models.size === 0) {
        setLoading(false);
        biomodels = null;
        const li = document.createElement('li');
        li.innerHTML = "No models found";
        dropdown!.innerHTML = "";
        dropdown!.appendChild(li);
        return;
      }
      // Otherwise, display the models in the dropdown
      dropdown!.style.display = "block";
      biomodels.models.forEach(function (model: any) {
        setLoading(false);
        const a = document.createElement('a');
        a.addEventListener('click', () => {
          biomodelBrowse.value = "";
          dropdown!.innerHTML = "";
          chosenModel = model.id;
          setChosenModel(chosenModel);
        });
        a.innerHTML = model.name + ": " + model.id + "\n";
        dropdown!.appendChild(a);
      });
    }, 300);
  });
}