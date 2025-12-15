/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Copies additional fields from source object to target object that are not in the known fields set.
 * This is useful for preserving extra API response fields that may be added in future versions.
 * This function modifies the target object in place.
 *
 * @param source - The source object containing fields to copy
 * @param target - The target object to copy fields to
 * @param knownFields - Set of field names that should be excluded from copying
 */
export const copyAdditionalFields = (
  source: Record<string, any>,
  target: Record<string, any>,
  knownFields: Set<string>
): void => {
  Object.keys(source).forEach((key) => {
    if (!knownFields.has(key) && source[key] !== undefined) {
      target[key] = source[key];
    }
  });
};
