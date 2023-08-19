interface Model {
    name: string;
    url: string;
    id: string;
}

interface Models {
    models: Map<String, Model>;
}

const corsProxyUrl = "https://api.allorigins.win/raw?url=";

export async function searchModels(search: KeyboardEvent) {
    try {
        const queryText = (search.target as HTMLInputElement).value.trim();
        const response = await fetch(corsProxyUrl + `https://www.ebi.ac.uk/biomodels/search?query=${queryText}%26numResults=100%26format=json`)
        if (response.ok) {
            const results = await response.json();
            const models: Models = { models: new Map() };
            results.models.forEach((model: any) => {
                models.models.set(model.id, {
                    name: model.name,
                    url: model.url,
                    id: model.id
                });
            });
            return models;
        } else {
            throw new Error('Error when fetching search results');
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getModel(modelId: string) {
    try {
        const response = await fetch(corsProxyUrl + `https://www.ebi.ac.uk/biomodels/model/download/${modelId}?filename=${modelId}_url.xml`);
        if (response.ok) {
            const model = await response.text();
            return model;
        } else {
            throw new Error('Error when fetching biomodel');
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}