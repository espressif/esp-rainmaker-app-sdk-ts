/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Converts a Uint8Array to a Base64 encoded string.
 *
 * @param {Uint8Array} uint8Array - The Uint8Array to convert.
 * @returns {string} The Base64 encoded string.
 */
const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
  let binaryString = "";
  for (let i = 0; i < uint8Array.length; i++) {
    binaryString += String.fromCharCode(uint8Array[i]);
  }

  return btoa(binaryString);
};

/**
 * Converts a Base64 encoded string to a Uint8Array.
 *
 * @param {string} base64 - The Base64 encoded string to convert.
 * @returns {Uint8Array} The resulting Uint8Array.
 */
const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);

  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
};

export { uint8ArrayToBase64, base64ToUint8Array };
