/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generates a version 4 UUID (Universally Unique Identifier).
 *
 * A UUID is a 128-bit number used to uniquely identify information in computer systems.
 * Version 4 UUIDs are randomly generated and have a specific format that includes
 * version and variant bits.
 *
 * The format of a version 4 UUID is: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
 * where:
 * - `x` is any hexadecimal digit (0-9, a-f)
 * - `4` indicates the version
 * - `y` is one of [8, 9, A, or B] (indicating the variant)
 *
 * @returns {string} A randomly generated version 4 UUID.
 */
const generateUUIDv4 = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

export { generateUUIDv4 };
