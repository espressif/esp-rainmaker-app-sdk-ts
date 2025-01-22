/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Represents a transformation rule that maps a source path to a target key,
 * with an optional transform function to modify the value.
 */
interface TransformationRule {
  /**
   * Path to the value in the source object.
   */
  sourcePath: string;

  /**
   * Key to store the transformed value in the output object.
   */
  targetKey: string;

  /**
   * Optional function to transform the value before assigning it to the target key.
   */
  transform?: (value: any) => any;
}

/**
 * Represents a configuration for transforming data based on event types.
 * Each event type maps to a set of transformation rules.
 */
interface TransformationConfig {
  /**
   * Event type mapped to its corresponding transformation rules.
   */
  [eventType: string]: TransformationRule[];
}

/**
 * Creates a transformation configuration for various event types.
 *
 * @param basePath - The base path for the source data fields.
 * @param overrides - Optional overrides for specific event types.
 * @returns A transformation configuration object.
 */
const createTransformationConfig = (
  basePath: string,
  overrides: Partial<TransformationConfig> = {}
): TransformationConfig => {
  const config: TransformationConfig = {
    "rmaker.event.node_params_changed": [
      { sourcePath: `${basePath}.event_type`, targetKey: "event_type" },
      { sourcePath: `${basePath}.timestamp`, targetKey: "timestamp" },
      { sourcePath: `${basePath}.event_data.node_id`, targetKey: "node_id" },
      { sourcePath: `${basePath}.event_data.payload`, targetKey: "payload" },
    ],
    "rmaker.event.user_node_added": [
      { sourcePath: `${basePath}.event_type`, targetKey: "event_type" },
      { sourcePath: `${basePath}.timestamp`, targetKey: "timestamp" },
      {
        sourcePath: `${basePath}.event_data.nodes`,
        targetKey: "payload",
        transform: (nodes: any) => JSON.stringify({ nodeIds: nodes }),
      },
    ],
    "rmaker.event.user_node_removed": [
      { sourcePath: `${basePath}.event_type`, targetKey: "event_type" },
      { sourcePath: `${basePath}.timestamp`, targetKey: "timestamp" },
      {
        sourcePath: `${basePath}.event_data.nodes`,
        targetKey: "payload",
        transform: (nodes: any) => JSON.stringify({ nodeIds: nodes }),
      },
    ],
    "rmaker.event.node_connected": [
      { sourcePath: `${basePath}.event_type`, targetKey: "event_type" },
      { sourcePath: `${basePath}.timestamp`, targetKey: "timestamp" },
      { sourcePath: `${basePath}.event_data.node_id`, targetKey: "node_id" },
    ],
    "rmaker.event.node_disconnected": [
      { sourcePath: `${basePath}.event_type`, targetKey: "event_type" },
      { sourcePath: `${basePath}.timestamp`, targetKey: "timestamp" },
      { sourcePath: `${basePath}.event_data.node_id`, targetKey: "node_id" },
    ],
  };

  // Apply overrides for specific event types
  Object.entries(overrides).forEach(([eventType, overrideRules]) => {
    config[eventType] = overrideRules as TransformationRule[];
  });

  return config;
};

/**
 * iOS-specific transformation configuration.
 */
const apnsTransformationConfig: TransformationConfig =
  createTransformationConfig("aps.alert.event_data_payload", {
    "rmaker.event.node_params_changed": [
      {
        sourcePath: "data.event_data_payload.event_type",
        targetKey: "event_type",
      },
      {
        sourcePath: "data.event_data_payload.timestamp",
        targetKey: "timestamp",
      },
      {
        sourcePath: "data.event_data_payload.event_data.node_id",
        targetKey: "node_id",
      },
      {
        sourcePath: "data.event_data_payload.event_data.payload",
        targetKey: "payload",
      },
    ],
  });

/**
 * Android-specific transformation configuration.
 */
const gcmTransformationConfig: TransformationConfig =
  createTransformationConfig("event_data_payload");

/**
 * Retrieves a nested value from an object using a dot-separated path.
 *
 * @param obj - The object to retrieve the value from.
 * @param path - The dot-separated path to the value.
 * @returns The value at the specified path or `undefined` if not found.
 */
function getValueByPath(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => acc && acc[key], obj);
}

/**
 * Transforms a payload based on the given transformation rules.
 *
 * @param payload - The input payload to transform.
 * @param rules - The transformation rules to apply.
 * @returns A transformed object or `null` if no rules are provided.
 */
function transformPayload(
  payload: Record<string, any>,
  rules: TransformationRule[]
): Record<string, any> | null {
  if (!rules) {
    return null;
  }

  return rules.reduce(
    (transformed, rule) => {
      let value = getValueByPath(payload, rule.sourcePath);
      if (value !== undefined) {
        transformed[rule.targetKey] = rule.transform
          ? rule.transform(value)
          : value;
      }
      return transformed;
    },
    {} as Record<string, any>
  );
}

/**
 * Recursively searches for a key in an object or array.
 *
 * @param obj - The object or array to search.
 * @param key - The key to find.
 * @returns The value of the key if found, otherwise `undefined`.
 */
function findKey(obj: any, key: string): any | undefined {
  if (obj && typeof obj === "object") {
    if (Array.isArray(obj)) {
      for (const item of obj) {
        const result = findKey(item, key);
        if (result !== undefined) {
          return result;
        }
      }
    } else if (obj.hasOwnProperty(key)) {
      return obj[key];
    } else {
      for (const value of Object.values(obj)) {
        const result = findKey(value, key);
        if (result !== undefined) {
          return result;
        }
      }
    }
  }
  return undefined;
}

/**
 * Transforms notification data using the appropriate transformation configuration.
 *
 * @param notificationData - The input notification data.
 * @returns A transformed object or `null` if no matching transformation rules are found.
 */
const transformNotificationData = (
  notificationData: Record<string, any>
): Record<string, any> | null => {
  const isIosNotificationData = findKey(notificationData, "aps") !== undefined;
  const notificationEventType = findKey(notificationData, "event_type");

  const transformationConfig = isIosNotificationData
    ? apnsTransformationConfig
    : gcmTransformationConfig;

  const transformationRule = transformationConfig[notificationEventType];
  return transformPayload(notificationData, transformationRule);
};

export { transformNotificationData };
