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
    const queryText = (search.target as HTMLInputElement).value.trim();
    console.log(queryText)
    await fetch(corsProxyUrl + `https://www.ebi.ac.uk/biomodels/search?query=${queryText}&numResults=100&format=json`, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            const models = data.models.map((model: any) => {
                return {
                    name: model.name,
                    url: model.url,
                    id: model.id
                }
            });
            return models;
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
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