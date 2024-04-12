import cache from "./testCache.json";
import { Octokit, App } from "octokit";
// import biomodels api to use the search function

/**
* Interface for storing a model
* @interface Model
* @property {string} name - The name of the model
* @property {string} url - The URL of the model
* @property {string} id - The ID of the model
* @property {string} title - The title of the model
*/
interface Model {
    name: string;
    url: string;
    id: string;
    title: string;
    authors: string[];
    citation: string | null;
    date: string;
    journal: string;
}

/**
 * Interface for the cached data stored in the JSON file
 * @interface CachedData
 * @property {string} name - The name of the model
 * @property {string[]} authors - The authors of the model
 * @property {string} url - The URL of the model
 * @property {string} model_id - The ID of the model
 * @property {string} title - The title of the model
 * @property {string} synopsis - The synopsis of the model
 */
interface CachedData {
  [key: string]: {
      name: string;
      authors: string[];
      url: string;
      model_id: string;
      title: string;
      synopsis: string;
      citation: string | null;
      date: string;
      journal: string;
  };
}

/**
 * Interface for the models returned by the cache search
 * @interface Models
 * @property {Map<String, Model>} models - The models returned by the cache search
 */
interface Models {
    models: Map<String, Model>;
}

// The cache of models retrieved from a JSON file
const cachedData: CachedData = cache;

// URL for the chosen model
let url: string;

/**
 * Function to search for models using the cached data
 * @param {KeyboardEvent} search - The search event
 * @returns {Promise<Models>} - A promise containing the models returned by the search
 */
export async function searchModels(search: KeyboardEvent) {
    try {
        // Get the search query
        const queryText = (search.target as HTMLInputElement).value.trim();
        const models: Models = { models: new Map() };

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
                id: modelData.model_id,
                title: modelData.title,
                authors: modelData.authors,
                citation: modelData.citation,
                date: modelData.date,
                journal: modelData.journal
              });
            }
          }
          // if the query has only one word, check if the word is in a model
          else if (Object.values(modelData).some(value => 
            typeof value === "string" && value.toLowerCase().includes(queryText.toLowerCase()))) {
            models.models.set(id, {
              name: modelData.name,
              url: modelData.url,
              id: modelData.model_id,
              title: modelData.title,
              authors: modelData.authors,
              citation: modelData.citation,
              date: modelData.date,
              journal: modelData.journal
            });
          }
        }
        return models;
    } catch (error) {
        // If there is an error, throw it
        throwError("Unable to fetch models from cache.");
    }
}

/**
 * Function to get a model from a GitHub repository
 * @param {string} modelId - The ID of the model to get
 * @returns {Promise<string>} - A promise containing the model
 */
export async function getModel(modelId: string) {
    try {
        // Fetch the model from the GitHub repository using the model ID and the GitHub API
        const octokit = new Octokit();
        const response = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
          owner: "sys-bio",
          repo: "BiomodelsStore",
          path: "biomodels/" + modelId,
          headers: {
            "Accept": "application/vnd.github+json"
          }
        });
        
        // If the model is found, decode the content and return it
        if (Array.isArray(response.data)) {
          const fileResponse = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
            owner: "sys-bio",
            repo: "BiomodelsStore",
            path: "biomodels/" + modelId + "/" + response.data[0].name,
            headers: {
              "Accept": "application/vnd.github+json"
            }
          });
          if ("content" in fileResponse.data) {
            const sbmlData = decodeURIComponent(Array.prototype.map.call(atob(fileResponse.data.content), (c: string) => {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)}).join(""));
            return {
              modelId: modelId,
              sbmlData: sbmlData,
              url: url,
              title: cachedData[modelId].title,
              authors: cachedData[modelId].authors,
              citation: cachedData[modelId].citation,
              date: cachedData[modelId].date,
              journal: cachedData[modelId].journal
            };
          } else {
            throwError("Unable to fetch model from GitHub repository.");
            return {
              modelId: "",
              sbmlData: "",
              url: "",
              title: "",
              authors: [],
              citation: "",
              date: "",
              journal: ""
            }
          }
        } else {
          throwError("Unable to fetch model from GitHub repository.");
          return {
            modelId: "",
            sbmlData: "",
            url: "",
            title: "",
            authors: [],
            citation: "",
            date: "",
            journal: ""
          }
        }
    } catch (error) {
        throwError("Model not found, please choose another model.");
        return {
          modelId: "",
          sbmlData: "",
          url: "",
          title: "",
          authors: [],
          citation: "",
          date: "",
          journal: ""
        }
    }
}

/**
 * Function to display an error message
 * @param {String} error - The error message to display
 * @returns {void}
 */
async function throwError(error: String) {
  const popup = document.createElement("div");
  popup.innerHTML = error.toString();
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.backgroundColor = "white";
  popup.style.padding = "20px";
  popup.style.border = "1px solid black";
  popup.style.borderRadius = "10px";
  popup.style.zIndex = "100";
  document.body.appendChild(popup);
  setTimeout(() => {
    document.body.removeChild(popup);
  }, 2500);
}

/**
 * Function to display the models in the dropdown
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoading - The setLoading function from the parent component
 * @param {React.Dispatch<React.SetStateAction<string | null>>} setChosenModel - The setChosenModel function from the parent component
 * @returns {void}
 */
export function getBiomodels(setLoading: React.Dispatch<React.SetStateAction<boolean>>, setChosenModel: React.Dispatch<React.SetStateAction<string | null>>) {
  const biomodelBrowse = document.getElementById("biomodel-browse") as HTMLInputElement;
  const dropdown = document.getElementById("dropdown");
  var biomodels: any;
  var chosenModel: any;

  biomodelBrowse.addEventListener("keyup", async (val) => {
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
        const li = document.createElement("li");
        li.innerHTML = "No models found";
        dropdown!.innerHTML = "";
        dropdown!.appendChild(li);
        return;
      }
      // Otherwise, display the models in the dropdown
      dropdown!.style.display = "block";
      biomodels.models.forEach(function (model: any) {
        setLoading(false);
        const a = document.createElement("a");
        a.addEventListener("click", () => {
          console.log(model.id);
          biomodelBrowse.value = "";
          dropdown!.innerHTML = "";
          chosenModel = model.id;
          url = model.url;
          setChosenModel(chosenModel);
        });
        // if author exists, display author, else display "No authors found"
        const authors = model.authors.length > 0 ? model.authors : "No authors found";
        a.innerHTML = `${model.title}<div style="color: #FD7F20;">${model.journal}, ${model.date} - ${authors}</div>`;
        dropdown!.appendChild(a);
      });
    }, 300);
    document.addEventListener("click", (e) => {
      if ((e.target as HTMLInputElement).id !== "biomodel-browse") {
        dropdown!.style.display = "none";
      }
    });
  });
}