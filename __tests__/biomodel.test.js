// Testing file to test biomodel search and see if the correct outputs are given when searching for a specific biomodel
import { searchModels, getModel } from "../features/BrowseBiomodels";
import { fireEvent } from "@testing-library/react";
import fs from 'fs';

// Tests to see if the biomodels are being returned
test('searchModels1', async () => {
    const search = document.createElement('input');
    search.value = 'Rohwer';
    const keyEvent = new KeyboardEvent('keyup', { key: 'Enter' });
    fireEvent(search, keyEvent);
    const models = await searchModels(keyEvent);
    expect(models).toBeDefined();
    expect(models["models"].size).toBe(2);
});
test('searchModels2', async () => {
    const search = document.createElement('input');
    search.value = 'test glucose';
    const keyEvent = new KeyboardEvent('keyup', { key: 'Enter' });
    fireEvent(search, keyEvent);
    const models = await searchModels(keyEvent);
    expect(models).toBeDefined();
    expect(models["models"].size).toBe(10);
});
test('searchModels3', async () => {
    const search = document.createElement('input');
    search.value = 'afhdfterwva';
    const keyEvent = new KeyboardEvent('keyup', { key: 'Enter' });
    fireEvent(search, keyEvent);
    const models = await searchModels(keyEvent);
    expect(models).toBeDefined();
    expect(models["models"].size).toBe(0);
});

// Tests to display the chosen biomodel from the search
test('getModel1', async () => {
    const model = await getModel('BIOMD0000000693');
    const modelFile = fs.readFileSync('src/__tests__/BIOMD0000000693.xml', 'utf8');
    expect(model).toBeDefined();
    expect(model[0]).toBe('BIOMD0000000693');
    expect(model[1]).toBe(modelFile);
});
test('getModel2', async () => {
    const model = await getModel('BIOMD1');
    expect(model).toBeDefined();
    expect(model[0]).toBe('BIOMD1');
    expect(model[1]).toBe('Model not found.');
});


