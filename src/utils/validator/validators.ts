/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Checks if the provided string is a valid URL.
 *
 * @param url - The string to validate as a URL.
 * @returns `true` if the string is a valid URL, otherwise `false`.
 */
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Checks if the provided value is a non-empty string.
 *
 * @param value - The value to validate.
 * @returns `true` if the value is a non-empty string, otherwise `false`.
 */
const isNonEmptyString = (value: unknown): boolean => {
  return typeof value === "string" && value.trim() !== "";
};

/**
 * Checks if the provided value is a valid object (not null or an array).
 *
 * @param obj - The value to validate as an object.
 * @returns `true` if the value is a valid object, otherwise `false`.
 */
const isValidObject = (obj: unknown): boolean => {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
};

const isObjectEmpty = (obj: Object) => {
  return Object.keys(obj).length === 0;
};

export { isValidUrl, isNonEmptyString, isValidObject, isObjectEmpty };
