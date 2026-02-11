import { FileInfoSummary } from "@/src/features/data-import/ui/FileInfoSummary";
import { useRef } from "react";

interface FileInputProps {
    selectedFile: File | null;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    fileError?: string | null;
    isLoading?: boolean;
    hasData: boolean | null;
    label?: string;
}

export const FileInput: React.FC<FileInputProps> = ({
    selectedFile,
    handleFileChange,
    isLoading = false,
    fileError = null,
    hasData = false,
    label = "Select File",
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => fileInputRef.current?.click();

    return (
        <>
            <div className="mb-4 w-56 max-w-xs sm:w-sm md:max-w-md">
                <label
                    htmlFor="csv-file"
                    aria-label="Select Csv File"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
                <input
                    ref={fileInputRef}
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    className="hidden"
                />

                <button
                    type="button"
                    title={selectedFile?.name || "Choose CSV file..."}
                    onClick={handleClick}
                    disabled={isLoading}
                    className="w-full truncate rounded-md border-2 border-gray-300 bg-white
                        px-4 py-2 text-left text-sm font-medium
                        text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus:outline-none
                        focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {selectedFile ? selectedFile.name : "Choose CSV file..."}
                </button>
            </div>

            {fileError && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
                    <p className="text-sm text-red-600">{fileError}</p>
                </div>
            )}

            {selectedFile && !fileError && !hasData && (
                <FileInfoSummary selectedFile={selectedFile} />
            )}
        </>
    );
};
