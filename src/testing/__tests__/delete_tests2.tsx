import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileExplorer from '../../components/file-explorer/FileExplorer';

describe('delete 2', () => {
  it('delete', async () => {
    let initialFiles = [
      { name: 'file1.txt', content: 'Content of file1' },
      { name: 'file2.txt', content: 'Content of file2' }
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

    const fileItem = screen.getByText('file1.txt');
    fireEvent.contextMenu(fileItem);

    const deleteOption = await screen.findByText('Delete');
    userEvent.click(deleteOption);

    expect(mockOnDeleteFile).toHaveBeenCalledWith('file1.txt');
  });
});
