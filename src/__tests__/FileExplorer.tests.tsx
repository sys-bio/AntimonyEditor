import { useState } from "react";
import { render, fireEvent } from "@testing-library/react";

import FileExplorer from "../components/file-explorer/FileExplorer";
import { act } from "react-dom/test-utils";

test("when renaming file, pressing enter should finish the rename", async () => {
    const initialFileName = "hi click me"
    const newFileName = "hi click me 2"

    // We have to create a container for the file explorer so we can use `useState` to mock the files.
    const FileExplorerMockContainer = () => {
        const [files, setFiles] = useState([
            { name: initialFileName, content: "hello world" },
        ])
        const [selectedFileName, setSelectedFileName] = useState(initialFileName);

        return (
            <FileExplorer
                files={files}
                setFiles={setFiles}
                onFileClick={jest.fn()}
                onDeleteFile={jest.fn()}
                selectedFileIndex={0}
                setSelectedFileIndex={jest.fn()}
                selectedFileName={selectedFileName}
                setSelectedFileName={setSelectedFileName}
            />
        )
    };

    const explorer = render(<FileExplorerMockContainer />);

    // right click the file button
    const fileButton = await explorer.findByText(initialFileName);
    expect(fileButton).toBeInstanceOf(HTMLButtonElement);
    await fireEvent.contextMenu(fileButton);

    /// now click rename
    const renameButton = await explorer.findByText("Rename")
    expect(renameButton).toBeInstanceOf(HTMLLIElement);
    await fireEvent.click(renameButton);

    // check that it is now renaming
    const fileInput = await explorer.findByDisplayValue(initialFileName);
    expect(fileInput).toBeInstanceOf(HTMLInputElement);

    // rename it
    await act(async () => {
        await fireEvent.change(fileInput, {
            target: {
                value: newFileName,
            }
        })
        await fireEvent.keyDown(fileInput, {
            key: "Enter",
        });
    });

    // the file should now be renamed
    const fileButton2 = await explorer.findByText(newFileName);
    expect(fileButton2).toBeInstanceOf(HTMLButtonElement);
    expect(fileButton2.textContent).toBe(newFileName);
})