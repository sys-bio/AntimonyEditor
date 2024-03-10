import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileExplorer from '../../components/file-explorer/FileExplorer';


describe('FileExplorer Delete Functionality', () => {
  it('updates the file list correctly after a file is deleted', async () => {
    let initialFiles = [
      { name: 'file1.xml', content: 'File1' },
      { name: 'file2.xml', content: 'File2' }
    ];

    const mockOnDeleteFile = jest.fn((fileName) => {
      initialFiles = initialFiles.filter(file => file.name !== fileName);
    });

    render(
      <FileExplorer
        files={initialFiles}
        onFileClick={() => {}}
        onDeleteFile={mockOnDeleteFile}
      />
    );

    const fileItem = screen.getByText('file1.xml');
    fireEvent.contextMenu(fileItem);

    const deleteOption = await screen.findByText('Delete');
    userEvent.click(deleteOption);

    expect(mockOnDeleteFile).toHaveBeenCalledWith('file1.xml');

    expect(initialFiles.length).toBe(1);
    expect(initialFiles).toEqual([{ name: 'file2.xml', content: 'File2' }]);
  });
});
