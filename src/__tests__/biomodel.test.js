// Testing file to test biomodel search and see if the correct outputs are given when searching for a specific biomodel
import { searchModels, getModel } from "../features/BrowseBiomodels";
import { fireEvent } from "@testing-library/react";
import fs from "fs";

// Mock fetch for biomodels cache
global.fetch = jest.fn();

// Mock Octokit for GitHub API calls
jest.mock("octokit", () => ({
  Octokit: jest.fn().mockImplementation(() => ({
    request: jest.fn(),
  })),
}));

// Mock biomodels cache data
const mockBiomodelsCache = {
  BIOMD0000000001: {
    name: "Test Model 1",
    title: "A test model for glucose metabolism",
    synopsis: "This model describes glucose metabolism in yeast",
    model_id: "BIOMD0000000001",
    url: "https://example.com/model1",
    authors: ["Author 1", "Author 2"],
    citation: "Test citation",
    date: "2023-01-01",
    journal: "Test Journal",
  },
  BIOMD0000000002: {
    name: "Rohwer Model",
    title: "Rohwer's glucose model",
    synopsis: "A model by Rohwer for glucose metabolism",
    model_id: "BIOMD0000000002",
    url: "https://example.com/model2",
    authors: ["Rohwer"],
    citation: "Rohwer citation",
    date: "2023-01-02",
    journal: "Rohwer Journal",
  },
  BIOMD0000000003: {
    name: "Another Rohwer Model",
    title: "Another model by Rohwer",
    synopsis: "Another glucose model by Rohwer",
    model_id: "BIOMD0000000003",
    url: "https://example.com/model3",
    authors: ["Rohwer"],
    citation: "Another Rohwer citation",
    date: "2023-01-03",
    journal: "Another Rohwer Journal",
  },
};

// Mock GitHub API response
const mockGitHubResponse = {
  data: [
    {
      name: "BIOMD0000000693.xml",
    },
  ],
};

const mockGitHubFileResponse = {
  data: {
    content: Buffer.from(
      '<sbml xmlns="http://www.sbml.org/sbml/level3/version2/core" level="3" version="2"><model id="test_model"><!-- Test SBML content --></model></sbml>'
    ).toString("base64"),
  },
};

beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();

  // Mock fetch to return biomodels cache
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => mockBiomodelsCache,
  });
});

// Tests to see if the biomodels are being returned
test("searchModels1", async () => {
  const search = document.createElement("input");
  search.value = "Rohwer";
  const keyEvent = new KeyboardEvent("keyup", { key: "Enter" });
  fireEvent(search, keyEvent);
  const models = await searchModels(keyEvent, "standard");
  expect(models).toBeDefined();
  expect(models["models"].size).toBe(2);
});

test("searchModels2", async () => {
  const search = document.createElement("input");
  search.value = "test glucose";
  const keyEvent = new KeyboardEvent("keyup", { key: "Enter" });
  fireEvent(search, keyEvent);
  const models = await searchModels(keyEvent, "standard");
  expect(models).toBeDefined();
  expect(models["models"].size).toBe(0); // 'test glucose' doesn't match any mock data
});

test("searchModels3", async () => {
  const search = document.createElement("input");
  search.value = "afhdfterwva";
  const keyEvent = new KeyboardEvent("keyup", { key: "Enter" });
  fireEvent(search, keyEvent);
  const models = await searchModels(keyEvent, "standard");
  expect(models).toBeDefined();
  expect(models["models"].size).toBe(0);
});

// Tests to display the chosen biomodel from the search
test("getModel1", async () => {
  // Mock Octokit constructor to return a mock instance
  const mockRequest = jest
    .fn()
    .mockResolvedValueOnce(mockGitHubResponse) // First call for directory listing
    .mockResolvedValueOnce(mockGitHubFileResponse); // Second call for file content

  const { Octokit } = require("octokit");
  Octokit.mockImplementation(() => ({
    request: mockRequest,
  }));

  // Mock the cachedData that getModel uses
  const browseBiomodels = require("../features/BrowseBiomodels");
  const originalCachedData = browseBiomodels.cachedData;
  browseBiomodels.cachedData = {
    BIOMD0000000693: {
      title: "Test Model",
      authors: ["Test Author"],
      citation: "Test Citation",
      date: "2023-01-01",
      journal: "Test Journal",
    },
  };

  const model = await getModel("BIOMD0000000693");
  expect(model).toBeDefined();
  expect(model.modelId).toBe("BIOMD0000000693");
  expect(model.sbmlData).toContain("<sbml");

  // Restore original cachedData
  browseBiomodels.cachedData = originalCachedData;
});

test("getModel2", async () => {
  // Mock Octokit request to return error response
  const { Octokit } = require("octokit");
  const mockOctokit = new Octokit();
  const mockRequest = jest.fn().mockRejectedValue(new Error("Model not found"));
  mockOctokit.request = mockRequest;

  const model = await getModel("BIOMD1");
  expect(model).toBeDefined();
  expect(model.modelId).toBe("");
  expect(model.sbmlData).toBe("");
});
