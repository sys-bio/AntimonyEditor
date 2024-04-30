import * as monaco from 'monaco-editor';

/**
 * Handles the download of the file
 * @param editorInstance - The Monaco editor instance
 * @param fileName - The name of the file to download
 */
const handleDownload = (editorInstance: monaco.editor.IStandaloneCodeEditor | null, fileName: string) => {
  // Download the file to the user's downloads folder
  if (editorInstance) {
    const blob = new Blob([editorInstance.getValue()], { type: 'ant' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

export default handleDownload;