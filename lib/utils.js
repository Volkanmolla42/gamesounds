import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

/**
 * Sınıf isimlerini birleştiren utility fonksiyonu.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * API istekleri için timeout özelliği eklenmiş fetch fonksiyonu
 */
export async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 8000 } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });
  
  clearTimeout(id);
  
  return response;
}

/**
 * Metin kısaltma yardımcı fonksiyonu
 */
export function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
