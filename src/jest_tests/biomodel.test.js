// Testing file to test biomodel search and see if the correct outputs are given when searching for a specific biomodel

import { getBiomodels, searchModels } from "../features/BrowseBiomodels";
import { fireEvent } from "@testing-library/react";

// Test to see if the biomodels are being returned
describe('searchModels', () => {
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
});


