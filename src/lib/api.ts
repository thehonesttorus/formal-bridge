/**
 * Formal Bridge API Client
 * 
 * Connects Next.js frontend to ASP.NET Core backend.
 * Handles Prescribed Part calculations and PDF certificate generation.
 */

// API base URL - configurable for different environments
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface CalculationRequest {
    netProperty: number;
    floatingChargeDate: string; // ISO date string
}

export interface CalculationResponse {
    certId: string;
    inputHash: string;
    netProperty: number;
    floatingChargeDate: string;
    firstTranche: number;
    secondTranche: number;
    uncappedTotal: number;
    capApplied: number;
    finalAmount: number;
    wasCapped: boolean;
    legislativeBasis: string;
    verificationSteps: string[];
}

export interface HealthResponse {
    status: string;
    version: string;
    engine: string;
}

/**
 * Calculate Prescribed Part via backend API
 */
export async function calculatePrescribedPart(
    netProperty: number,
    floatingChargeDate: Date
): Promise<CalculationResponse> {
    const response = await fetch(`${API_BASE_URL}/api/prescribedpart/calculate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            netProperty,
            floatingChargeDate: floatingChargeDate.toISOString(),
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `API error: ${response.status}`);
    }

    return response.json();
}

/**
 * Generate PDF certificate via backend API
 * Returns a Blob for download
 */
export async function generateCertificatePdf(
    netProperty: number,
    floatingChargeDate: Date
): Promise<{ blob: Blob; filename: string }> {
    const response = await fetch(`${API_BASE_URL}/api/prescribedpart/certificate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            netProperty,
            floatingChargeDate: floatingChargeDate.toISOString(),
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `API error: ${response.status}`);
    }

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'FormalBridge_Certificate.pdf';
    if (contentDisposition) {
        const match = contentDisposition.match(/filename=(.+)/);
        if (match) {
            filename = match[1].replace(/"/g, '');
        }
    }

    const blob = await response.blob();
    return { blob, filename };
}

/**
 * Download PDF certificate - triggers browser download
 */
export async function downloadCertificatePdf(
    netProperty: number,
    floatingChargeDate: Date
): Promise<void> {
    const { blob, filename } = await generateCertificatePdf(netProperty, floatingChargeDate);

    // Create download link and trigger
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Check API health
 */
export async function checkApiHealth(): Promise<HealthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/prescribedpart/health`);
    if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
    }
    return response.json();
}

/**
 * Check if API is available
 */
export async function isApiAvailable(): Promise<boolean> {
    try {
        await checkApiHealth();
        return true;
    } catch {
        return false;
    }
}
