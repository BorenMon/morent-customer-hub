import type { Router } from 'vue-router'

export const formatToTwoDecimals = (value: number | string): string => {
  return parseFloat(value.toString()).toFixed(2);
}

export const formatISODate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

export const redirectSearch = (router: Router, keyword: string): void => {
  router.push({ path: '/category', query: { keyword } });
}

export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) { // Type 'this' explicitly here
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  }
}

export function areObjectsEqual(obj1: Record<string, any>, obj2: Record<string, any>): boolean {
  // Check if both are objects
  if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 === null || obj2 === null) {
    return false; // Either not objects or one is null
  }

  // Get keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if number of keys is the same
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Check if all keys and their values are equal
  return keys1.every(key => obj2.hasOwnProperty(key) && obj1[key] === obj2[key]);
}

/**
 * Converts a snake_case string to Capitalized Case with spaces replacing underscores.
 * 
 * @param {string} snakeCaseStr - The snake_case string to be converted.
 * @returns {string} - The string converted to Capitalized Case with spaces.
 */
export function snakeToCapitalizedWithSpaces(snakeCaseStr: string): string {
  return snakeCaseStr
    .split('_') // Split the string by underscores
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(' '); // Join the words with spaces
}
