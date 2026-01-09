/**
 * Generate a unique verification code for certificates
 * Format: FB-XXXXXX-XXXX (12 alphanumeric characters + prefix)
 */
export function generateVerificationCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed I, O, 0, 1 for readability
    let code = '';

    for (let i = 0; i < 10; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Format: FB-XXXXXX-XXXX
    return `FB-${code.slice(0, 6)}-${code.slice(6)}`;
}

/**
 * Current InsolvencyLib kernel version
 */
export const KERNEL_VERSION = 'InsolvencyLib v1.0.0-lean4';
