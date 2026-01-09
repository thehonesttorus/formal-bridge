"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import {
    Upload,
    FileSpreadsheet,
    CheckCircle,
    AlertCircle,
    Table,
    Columns
} from "lucide-react";
import { generateFileHash, formatHash } from "@/lib/fileHash";
import { stripPii, StripResult, SpreadsheetRow } from "@/lib/piiStripper";

interface ExcelUploadProps {
    onDataParsed: (data: SpreadsheetRow[], hash: string, fileName: string) => void;
    onColumnsDetected?: (columns: string[]) => void;
}

interface ParsedData {
    rows: SpreadsheetRow[];
    columns: string[];
    fileName: string;
    fileHash: string;
    stripResult: StripResult;
}

export default function ExcelUpload({ onDataParsed, onColumnsDetected }: ExcelUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [parsedData, setParsedData] = useState<ParsedData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const processFile = async (file: File) => {
        setIsProcessing(true);
        setError(null);

        try {
            // Check file type
            const validTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                'application/vnd.ms-excel', // .xls
                'text/csv'
            ];

            if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
                throw new Error('Please upload an Excel file (.xlsx, .xls) or CSV');
            }

            // Generate file hash (liability shield - before parsing)
            const fileHash = await generateFileHash(file);

            // Read file with SheetJS
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });

            // Get first sheet
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json<SpreadsheetRow>(worksheet, {
                defval: null,
                raw: false, // Get formatted strings
            });

            if (jsonData.length === 0) {
                throw new Error('The spreadsheet appears to be empty');
            }

            // Get column names
            const columns = Object.keys(jsonData[0]);

            // Strip PII
            const stripResult = stripPii(jsonData);

            const parsed: ParsedData = {
                rows: stripResult.cleanedData,
                columns: Object.keys(stripResult.cleanedData[0] || {}),
                fileName: file.name,
                fileHash,
                stripResult,
            };

            setParsedData(parsed);
            onColumnsDetected?.(parsed.columns);
            onDataParsed(parsed.rows, fileHash, file.name);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to parse file');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    };

    return (
        <div className="space-y-6">
            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer
                    ${isDragging
                        ? 'border-teal bg-teal/10'
                        : parsedData
                            ? 'border-teal/50 bg-teal/5'
                            : error
                                ? 'border-red-500/50 bg-red-500/5'
                                : 'border-slate-700 hover:border-slate-500'
                    }
                `}
            >
                <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {isProcessing ? (
                    <div className="space-y-3">
                        <div className="w-12 h-12 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-slate-400">Processing spreadsheet...</p>
                    </div>
                ) : parsedData ? (
                    <div className="space-y-3">
                        <CheckCircle className="w-12 h-12 text-teal mx-auto" />
                        <p className="text-white font-medium">{parsedData.fileName}</p>
                        <p className="text-sm text-teal">
                            {parsedData.rows.length} rows &bull; {parsedData.columns.length} columns
                        </p>
                    </div>
                ) : error ? (
                    <div className="space-y-3">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                        <p className="text-red-400">{error}</p>
                        <p className="text-sm text-slate-500">Click or drop to try again</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <FileSpreadsheet className="w-12 h-12 text-slate-500 mx-auto" />
                        <div>
                            <p className="text-white font-medium mb-1">
                                Drag & Drop Your Excel File
                            </p>
                            <p className="text-sm text-slate-500">
                                or click to browse
                            </p>
                        </div>
                        <p className="text-xs text-slate-600">
                            Supports: .xlsx, .xls, .csv
                        </p>
                    </div>
                )}
            </div>

            {/* Parse Results */}
            {parsedData && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    {/* File Hash */}
                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                            <CheckCircle className="w-3 h-3 text-teal" />
                            Input Integrity Anchor (SHA-256)
                        </div>
                        <code className="text-xs font-mono text-teal break-all">
                            {parsedData.fileHash}
                        </code>
                    </div>

                    {/* Stripped Columns Warning */}
                    {parsedData.stripResult.strippedColumns.length > 0 && (
                        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                                <div>
                                    <p className="text-sm text-amber-400 font-medium">
                                        Sensitive columns removed
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {parsedData.stripResult.strippedColumns.join(', ')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Data Preview */}
                    <div className="border border-white/10 rounded-lg overflow-hidden">
                        <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center gap-2">
                            <Table className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-400">Data Preview (first 5 rows)</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead className="bg-white/5">
                                    <tr>
                                        {parsedData.columns.slice(0, 6).map((col) => (
                                            <th key={col} className="px-3 py-2 text-left text-slate-400 font-medium">
                                                {col}
                                            </th>
                                        ))}
                                        {parsedData.columns.length > 6 && (
                                            <th className="px-3 py-2 text-slate-600">+{parsedData.columns.length - 6}</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {parsedData.rows.slice(0, 5).map((row, i) => (
                                        <tr key={i} className="border-t border-white/5">
                                            {parsedData.columns.slice(0, 6).map((col) => (
                                                <td key={col} className="px-3 py-2 text-slate-300">
                                                    {String(row[col] ?? '-')}
                                                </td>
                                            ))}
                                            {parsedData.columns.length > 6 && (
                                                <td className="px-3 py-2 text-slate-600">...</td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Columns Detected */}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Columns className="w-3 h-3" />
                        <span>Columns: {parsedData.columns.join(', ')}</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
