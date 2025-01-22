/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Checks if a given value is a valid value of the specified enum type.
 *
 * This utility function verifies whether a provided value exists within the
 * values of a given enumeration, ensuring type safety and correctness.
 *
 * @param value - The value to validate against the enum.
 * @param enumType - The enum object to check the value against.
 * @returns `true` if the value exists within the enum, otherwise `false`.
 */
const isValidEnumValue = (value: any, enumType: object): boolean => {
  return Object.values(enumType).includes(value);
};

export { isValidEnumValue };
