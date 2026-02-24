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
        <section className="mb-4 w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col items-center" aria-labelledby="file-input-label">
            <label
                id="file-input-label"
                htmlFor="csv-file"
                className="mb-2 block text-sm font-semibold text-gray-800"
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
                aria-label="CSV file input"
            />
            <button
                type="button"
                title={selectedFile?.name || "Choose CSV file..."}
                onClick={handleClick}
                disabled={isLoading}
                className={`w-full truncate rounded-lg border-2 ${fileError ? 'border-red-400' : 'border-gray-300'} bg-white px-4 py-2 text-left text-base font-medium text-gray-900 hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150`}
                aria-describedby={fileError ? 'file-error-message' : undefined}
            >
                {selectedFile ? selectedFile.name : "Choose CSV file..."}
            </button>

            {fileError && (
                <div className="mt-3 w-full rounded-md border border-red-300 bg-red-50 p-3" role="alert" id="file-error-message">
                    <p className="text-sm text-red-700">{fileError}</p>
                </div>
            )}

            {selectedFile && !fileError && !hasData && (
                <div className="mt-3 w-full">
                    <FileInfoSummary selectedFile={selectedFile} />
                </div>
            )}
        </section>
    );
};
