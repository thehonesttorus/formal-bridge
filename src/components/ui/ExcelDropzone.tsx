'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';

export interface ParsedSpreadsheet {
    fileName: string;
    sheetName: string;
    columns: string[];
    rows: Record<string, string | number | null>[];
    rawFile: File;
}

interface ExcelDropzoneProps {
    onParsed: (data: ParsedSpreadsheet) => void;
    onError: (error: string) => void;
}

export function ExcelDropzone({ onParsed, onError }: ExcelDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const parseExcel = useCallback(async (file: File) => {
        setIsProcessing(true);
        setFileName(file.name);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json<Record<string, string | number | null>>(worksheet, {
                defval: null,
                raw: false,
            });

            if (jsonData.length === 0) {
                throw new Error('Spreadsheet appears to be empty');
            }

            const columns = Object.keys(jsonData[0]);

            onParsed({
                fileName: file.name,
                sheetName,
                columns,
                rows: jsonData,
                rawFile: file,
            });
        } catch (err) {
            onError(err instanceof Error ? err.message : 'Failed to parse spreadsheet');
        } finally {
            setIsProcessing(false);
        }
    }, [onParsed, onError]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv'))) {
            parseExcel(file);
        } else {
            onError('Please upload an Excel file (.xlsx, .xls) or CSV');
        }
    }, [parseExcel, onError]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            parseExcel(file);
        }
    }, [parseExcel]);

    return (
        <motion.div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
                relative border transition-all duration-300 cursor-pointer p-16 text-center
                ${isDragging
                    ? 'border-teal bg-teal/5'
                    : 'border-slate-800/50 hover:border-slate-700'}
                ${isProcessing ? 'pointer-events-none opacity-60' : ''}
            `}
        >
            <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {isProcessing ? (
                <div>
                    <p className="text-white font-light text-lg">Parsing {fileName}...</p>
                    <p className="text-slate-500 font-light text-sm mt-2">Extracting creditor data</p>
                </div>
            ) : fileName ? (
                <div>
                    <p className="text-teal font-mono text-sm tracking-wide mb-2">FILE LOADED</p>
                    <p className="text-white font-light text-lg">{fileName}</p>
                    <p className="text-slate-500 font-light text-sm mt-2">Drop another file to replace</p>
                </div>
            ) : (
                <div>
                    <p className="text-white font-light text-xl mb-2">
                        {isDragging ? 'Release to upload' : 'Drop your creditor schedule here'}
                    </p>
                    <p className="text-slate-500 font-light text-sm">
                        or click to browse &bull; .xlsx, .xls, .csv
                    </p>
                    <p className="text-slate-600 font-light text-xs mt-6">
                        Zero-retention &bull; All processing happens locally
                    </p>
                </div>
            )}
        </motion.div>
    );
}
