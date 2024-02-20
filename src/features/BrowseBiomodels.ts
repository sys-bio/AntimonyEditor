import cache from "./test_cache.json";
import { Octokit, App } from "octokit";
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
        const models: Models = { models: new Map() };
        let unmatched: boolean = false;
        console.log(queryText);
        for (const id in cachedData) {
          // if the query has multiple words, split them and check if all words are in a model
          const modelData = cachedData[id];
          if (queryText.includes(" ")) {
            const queryWords = queryText.split(" ");
            // the model should contain all the words in the query standalone, not as part of a word
            if (queryWords.every(word => Object.values(modelData).some(value => 
              typeof value === "string" && (value as string).toLowerCase().includes(word.toLowerCase())))) {
              models.models.set(id, {
                name: modelData.name,
                url: modelData.url,
                id: modelData.model_id
              });
            }
            // for (const word of queryWords) {
            //   if (!Object.values(modelData).some(value => 
            //     typeof value === "string" && (value as string).toLowerCase().includes(word.toLowerCase()))) {
            //     unmatched = true;
            //     break;
            //   }
            // }
            // if (unmatched) {
            //   unmatched = false;
            // } else {
            //   models.models.set(id, {
            //     name: modelData.name,
            //     url: modelData.url,
            //     id: modelData.model_id
            //   });
            // }
          }
          // if the query has only one word, check if the word is in a model
          else if (Object.values(modelData).some(value => 
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
 * Function to get a model from a Git
 * @param {string} modelId - The ID of the model to get
 * @returns {Promise<string>} - A promise containing the model
 */
export async function getModel(modelId: string) {
    try {
        // Fetch the model from the GitHub repository using the model ID and the GitHub API
        const octokit = new Octokit();
        const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner: 'konankisa',
          repo: 'BiomodelsStore',
          path: "biomodels/" + modelId + ".xml",
          headers: {
            'Accept': 'application/vnd.github+json'
          }
        });
        if (response.status === 200) {
          // If the model is found, decode the content and return it
          if ("content" in response.data) {
            let model = atob(response.data.content);
            console.log(model);
            return model;
          } else {
            throw new Error('Error when fetching biomodel');
          }
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