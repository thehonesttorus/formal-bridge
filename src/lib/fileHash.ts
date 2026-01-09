/**
 * File Hash Utility
 * 
 * Generates SHA-256 hash of uploaded files.
 * This hash goes on the certificate as the "Input Integrity Anchor"
 * WITHOUT storing the actual file - our liability shield.
 */

import CryptoJS from 'crypto-js';

/**
 * Generate SHA-256 hash from file
 * @param file - The uploaded file
 * @returns Promise<string> - The SHA-256 hash as hex string
 */
export async function generateFileHash(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const arrayBuffer = e.target?.result as ArrayBuffer;
                const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
                const hash = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
                resolve(hash);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Generate hash from any string data
 * @param data - String data to hash
 * @returns string - The SHA-256 hash
 */
export function generateDataHash(data: string): string {
    return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
}

/**
 * Format hash for display (truncated with ellipsis)
 * @param hash - Full hash string
 * @returns string - Formatted as "0x7F3A...C91B"
 */
export function formatHash(hash: string): string {
    if (hash.length < 16) return hash;
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
}
