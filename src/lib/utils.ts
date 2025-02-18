import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function highlightText(text: string, query: string) {
  if (!query) return text;

  // Escape special characters in the query
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Create parts array by splitting on the query (case insensitive)
  const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
  
  // Return the parts with matches wrapped in a span with blue text
  return parts.map((part, i) => {
    if (part.toLowerCase() === query.toLowerCase()) {
      return `<span class="text-blue-600">${part}</span>`;
    }
    return part;
  }).join('');
}

export function getMatchScore(text: string, query: string): number {
  if (!query || !text) return 0;
  
  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  
  // Match exato
  if (normalizedText === normalizedQuery) return 1;
  
  // Começa com a query
  if (normalizedText.startsWith(normalizedQuery)) return 0.8;
  
  // Contém a query como uma palavra completa
  if (new RegExp(`\\b${query}\\b`, 'i').test(text)) return 0.6;
  
  // Contém a query em qualquer lugar
  if (normalizedText.includes(normalizedQuery)) return 0.4;
  
  // Não contém a query
  return 0;
}