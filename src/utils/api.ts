// Vercel Serverless and Shared Server Backend Synchronization
import { StudentEntry, Suggestion } from '../types';

export interface BackendData {
  suggestions?: Suggestion[];
  students?: StudentEntry[];
  status?: string;
}

// Check both /api/data (Vercel) and /api.php (PHP / Shared Host)
export async function fetchRemoteData(): Promise<{ suggestions: Suggestion[] | null; students: StudentEntry[] | null }> {
  // 1. Try Vercel Serverless Function
  try {
    const response = await fetch('/api/data?action=get_all', {
      cache: 'no-cache',
      headers: { 'Accept': 'application/json' },
    });

    if (response.ok) {
      const data: BackendData = await response.json();
      if (Array.isArray(data.suggestions) || Array.isArray(data.students)) {
        return {
          suggestions: Array.isArray(data.suggestions) ? data.suggestions : null,
          students: Array.isArray(data.students) ? data.students : null,
        };
      }
    }
  } catch {
    // Vercel function not available, fallback to api.php
  }

  // 2. Fallback to api.php (InfinityFree / PHP hosting)
  try {
    const response = await fetch('./api.php?action=get_all', {
      cache: 'no-cache',
      headers: { 'Accept': 'application/json' },
    });

    if (response.ok) {
      const data: BackendData = await response.json();
      return {
        suggestions: Array.isArray(data.suggestions) ? data.suggestions : null,
        students: Array.isArray(data.students) ? data.students : null,
      };
    }
  } catch {
    // Both endpoints unavailable
  }

  return { suggestions: null, students: null };
}

export async function saveSuggestionsToRemote(suggestions: Suggestion[]): Promise<boolean> {
  // 1. Try Vercel
  try {
    const response = await fetch('/api/data?action=save_suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suggestions }),
    });
    if (response.ok) return true;
  } catch {
    // Fallback to PHP
  }

  // 2. Try PHP
  try {
    const response = await fetch('./api.php?action=save_suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suggestions }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function saveStudentsToRemote(students: StudentEntry[]): Promise<boolean> {
  // 1. Try Vercel
  try {
    const response = await fetch('/api/data?action=save_students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ students }),
    });
    if (response.ok) return true;
  } catch {
    // Fallback to PHP
  }

  // 2. Try PHP
  try {
    const response = await fetch('./api.php?action=save_students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ students }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
