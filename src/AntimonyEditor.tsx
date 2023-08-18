import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';

interface CodeEditorProps {
  content: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ content }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      const editor = monaco.editor.create(editorRef.current, {
        value: content,
        language: 'antimony',
      });

      return () => editor.dispose();
    }
  }, [content]);

  return <div className="code-editor" ref={editorRef} style={{ height: '80vh' }}></div>;
};

export default CodeEditor;
