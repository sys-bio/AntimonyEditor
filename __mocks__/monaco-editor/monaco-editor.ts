import { jest } from '@jest/globals';

const monacoEditorMock = {
  editor: {
    create: jest.fn(),
    defineTheme: jest.fn(),
    setTheme: jest.fn(),
  },
  languages: {
    register: jest.fn(),
    setMonarchTokensProvider: jest.fn(),
    setLanguageConfiguration: jest.fn(),
  },
  
};


export default monacoEditorMock as any; 
