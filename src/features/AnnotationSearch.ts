


// const corsProxyUrl = "https://api.allorigins.win/raw?url=";

// export async function searchModels(search: KeyboardEvent) {
//   try {
//       const queryText = (search.target as HTMLInputElement).value.trim();
//       const response = await fetch(corsProxyUrl + `https://www.ebi.ac.uk/biomodels/search?query=${queryText}%26numResults=25%26format=json`)
//       if (response.ok) {
//           const results = await response.json();
//           const models: Models = { models: new Map() };
//           results.models.forEach((model: any) => {
//               if (model.id in models.models) return;
//               models.models.set(model.id, {
//                   name: model.name,
//                   url: model.url,
//                   id: model.id
//               });
//           });
//           return models;
//       } else {
//           throw new Error('Error when fetching search results');
//       }
//   } catch (error) {
//       console.log(error);
//       throw error;
//   }
// }

export {}