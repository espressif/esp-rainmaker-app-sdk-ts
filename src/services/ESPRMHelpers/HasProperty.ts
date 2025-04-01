/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { PropertyCheckMode } from "../../types/input";

/**
 * Checks if an object has a property with the specified key.
 *
 * This utility function verifies whether an object has a property with the specified key.
 * It allows choosing between checking in the entire prototype chain or only the object's own properties.
 *
 * @param obj - The object to check for the property.
 * @param key - The key to check for in the object.
 * @param mode - The mode specifying whether to check own properties only or include the prototype chain.
 * @returns `true` if the object has the property based on the chosen method, otherwise `false`.
 */
const hasProperty = <T>(
  obj: T,
  key: keyof T,
  mode: PropertyCheckMode = PropertyCheckMode.PrototypeChain
): obj is T => {
  return Boolean(
    obj &&
      typeof obj === "object" &&
      (mode === PropertyCheckMode.OwnPropertyOnly
        ? Object.prototype.hasOwnProperty.call(obj, key)
        : key in obj)
  );
};

export { hasProperty };
