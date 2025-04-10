import { useState } from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FileExplorer from "../components/file-explorer/FileExplorer";

test("when renaming file, pressing enter should finish the rename", async () => {
    const initialFileName = "hi click me";
    const newFileName = "hi click me 2";
    const fileContent = "hello world";
    const typeThis = " 2[Enter]"; // This is what they type to go from the initial file name to the new file name

    // We have to create a container for the file explorer so we can use `useState` to mock the files.
    const FileExplorerMockContainer = () => {
        const [files, setFiles] = useState([
            { name: initialFileName, content: fileContent },
        ])
        const [selectedFileName, setSelectedFileName] = useState(initialFileName);

        const mockDatabase = {
            transaction: () => ({
                objectStore: () => ({
                    get: () => Promise.resolve({ content: fileContent }),
                }),
            }),
        };

        return (
            <FileExplorer
                database={mockDatabase as any}
                files={files}
                setFiles={setFiles}
                onFileClick={jest.fn()}
                onDeleteFile={jest.fn()}
                handleNewFile={jest.fn()}
                selectedFileIndex={0}
                setSelectedFileIndex={jest.fn()}
                selectedFileName={selectedFileName}
                setSelectedFileName={setSelectedFileName}
            />
        );
    };

    const explorer = render(<FileExplorerMockContainer />);

    // right click the file button
    const fileButton = await explorer.findByText(initialFileName);
    expect(fileButton).toBeInstanceOf(HTMLButtonElement);
    await userEvent.pointer({ keys: "[MouseRight]", target: fileButton });

    /// now click rename
    const renameButton = await explorer.findByText("Rename")
    expect(renameButton).toBeInTheDocument();
    await userEvent.click(renameButton);

    // check that it is now renaming
    const fileInput = await explorer.findByDisplayValue(initialFileName);
    expect(fileInput).toBeInstanceOf(HTMLInputElement);
    expect(fileInput).toHaveFocus();

    // type into the box the new name
    await userEvent.keyboard(typeThis);

    // the file should now be renamed
    const fileButton2 = await explorer.findByText(newFileName);
    expect(fileButton2).toBeInstanceOf(HTMLButtonElement);
});