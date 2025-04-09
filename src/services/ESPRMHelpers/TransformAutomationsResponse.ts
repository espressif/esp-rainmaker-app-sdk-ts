/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ESPAutomationInterface,
  ESPAutomationEventType,
  ESPWeatherEvent,
  ESPDaylightEvent,
  ESPAutomationEvent,
  ESPWeatherParameter,
  ESPAutomationConditionOperator,
  ESPWeatherCondition,
} from "../../types/automation";

/**
 * Transforms the backend automation response to ESPAutomationInterface
 * @param automationResponse - The automation response from the backend
 * @returns The transformed automation interface
 */
export function transformAutomationsResponse(
  automationResponse: any
): ESPAutomationInterface {
  const {
    name,
    automation_id,
    enabled,
    node_id,
    event_type,
    metadata,
    events,
    event_operator,
    actions,
    location,
    retrigger,
    region,
  } = automationResponse;

  // Transform events array based on event_type
  const transformedEvents = events.map((event: any) => {
    // Handle different event types
    switch (event_type) {
      case ESPAutomationEventType.Weather:
        // For weather events, params can contain either weather_condition or weather parameters
        const weatherParam = Object.keys(event.params || {})[0];
        if (weatherParam === "weather_condition") {
          // This is a weather condition enum
          return event.params.weather_condition as ESPWeatherCondition;
        } else {
          // This is a weather parameter event
          return {
            param: weatherParam as ESPWeatherParameter,
            value: event.params[weatherParam],
            check: event.check as ESPAutomationConditionOperator,
          } as ESPWeatherEvent;
        }

      case ESPAutomationEventType.Daylight:
        // For daylight events, the key in params is the event type
        const daylightEvent = Object.keys(event.params || {})[0];
        return daylightEvent as ESPDaylightEvent;

      default:
        // For node parameter events, extract device name and param from nested structure
        const deviceName = Object.keys(event.params || {})[0];
        const deviceParams = event.params[deviceName] || {};
        const param = Object.keys(deviceParams)[0];
        const value = deviceParams[param];

        return {
          deviceName: deviceName || "",
          param: param || "",
          value,
          check: event.check as ESPAutomationConditionOperator,
        } as ESPAutomationEvent;
    }
  });

  // Transform actions array
  const transformedActions = actions.map((action: any) => {
    // Extract device name and params from the nested structure
    const deviceName = Object.keys(action.params || {})[0];
    const deviceParams = action.params[deviceName] || {};
    const param = Object.keys(deviceParams)[0];
    const value = deviceParams[param];

    return {
      nodeId: action.node_id,
      deviceName: deviceName || "",
      param: param || "",
      value,
    };
  });

  // Create the base automation interface
  const transformedAutomationResponse: ESPAutomationInterface = {
    automationName: name,
    automationId: automation_id,
    enabled: enabled,
    eventType: event_type,
    metadata: metadata ?? {},
    events: transformedEvents,
    eventOperator: event_operator,
    actions: transformedActions,
    ...(node_id !== undefined && { nodeId: node_id }),
    ...(location !== undefined && { location: location }),
    ...(retrigger !== undefined && { retrigger: retrigger }),
    ...(region !== undefined && { region: region }),
  };

  return transformedAutomationResponse;
}
