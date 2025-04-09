/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAutomation } from "../../../src/ESPAutomation";
import {
  ESPAutomationInterface,
  ESPAutomationEventType,
  ESPAutomationEventOperator,
  ESPAutomationConditionOperator,
  ESPAutomationEvent,
  ESPAutomationAction,
  ESPAutomationDetails,
  ESPDaylightEvent,
  ESPDaylightAutomationDetails,
  ESPWeatherParameter,
  ESPWeatherAutomationDetails,
  ESPGeoCoordinates,
  ESPRawAutomationResponse,
  ESPAutomationUpdateDetails,
  ESPWeatherEvent,
  ESPWeatherCondition,
} from "../../../src/types/automation";
import { ESPRMNode } from "../../../src/ESPRMNode";
import { ESPRMUser } from "../../../src/ESPRMUser";
import { ESPAPIResponse, Keys, StatusMessage } from "../../../src";
import { configureAuthInstance } from "../../utils/configureAuthInstance";

export const MOCK_NODE_ID = "test-node-id";

export const MOCK_NODE = new ESPRMNode({
  id: MOCK_NODE_ID,
  transportOrder: [],
  availableTransports: {},
});

export const MOCK_AUTOMATION_ID = "test-automation-id";

export const MOCK_INVALID_AUTOMATION_ID = "";

export const MOCK_GEO_COORDINATES: ESPGeoCoordinates = {
  latitude: "12.9716",
  longitude: "77.5946",
};

export const MOCK_AUTOMATION_EVENT: ESPAutomationEvent = {
  deviceName: "Switch",
  param: "Power",
  value: true,
  check: ESPAutomationConditionOperator.EQUAL,
};

export const MOCK_AUTOMATION_ACTION: ESPAutomationAction = {
  nodeId: MOCK_NODE_ID,
  deviceName: "Light",
  param: "Power",
  value: true,
};

export const MOCK_AUTOMATION_DETAILS: ESPAutomationDetails = {
  name: "Test Automation",
  events: [MOCK_AUTOMATION_EVENT],
  actions: [MOCK_AUTOMATION_ACTION],
  eventOperator: ESPAutomationEventOperator.AND,
  retrigger: false,
};

export const MOCK_DAYLIGHT_AUTOMATION_DETAILS: ESPDaylightAutomationDetails = {
  name: "Test Daylight Automation",
  events: [ESPDaylightEvent.Sunrise],
  actions: [MOCK_AUTOMATION_ACTION],
  eventOperator: ESPAutomationEventOperator.AND,
  retrigger: false,
  location: {
    latitude: "12.9716",
    longitude: "77.5946",
  },
};

export const MOCK_WEATHER_AUTOMATION_DETAILS: ESPWeatherAutomationDetails = {
  name: "Test Weather Automation",
  events: [
    {
      param: ESPWeatherParameter.Temperature,
      value: "25",
      check: ESPAutomationConditionOperator.GREATER_THAN,
    },
  ],
  actions: [MOCK_AUTOMATION_ACTION],
  eventOperator: ESPAutomationEventOperator.AND,
  retrigger: false,
  location: {
    latitude: "12.9716",
    longitude: "77.5946",
  },
};

export const MOCK_WEATHER_CONDITION_AUTOMATION_DETAILS: ESPWeatherAutomationDetails =
  {
    name: "Test Weather Condition Automation",
    events: [ESPWeatherCondition.Rain, ESPWeatherCondition.Clear],
    actions: [MOCK_AUTOMATION_ACTION],
    eventOperator: ESPAutomationEventOperator.OR,
    retrigger: false,
    location: {
      latitude: "12.9716",
      longitude: "77.5946",
    },
  };

// Mock automation data for different event types
export const MOCK_AUTOMATION_DATA: ESPAutomationInterface = {
  automationName: "Mock Automation",
  automationId: "mock_automation_id",
  enabled: true,
  eventType: ESPAutomationEventType.NodeParams,
  events: [],
  eventOperator: ESPAutomationEventOperator.AND,
  actions: [],
  nodeId: "mock_node_id",
  retrigger: false,
};

export const MOCK_DAYLIGHT_AUTOMATION_DATA: ESPAutomationInterface = {
  automationName: "Mock Daylight Automation",
  automationId: "mock_daylight_automation_id",
  enabled: true,
  eventType: ESPAutomationEventType.Daylight,
  events: [ESPDaylightEvent.Sunrise],
  eventOperator: ESPAutomationEventOperator.AND,
  actions: [MOCK_AUTOMATION_ACTION],
  retrigger: false,
  location: MOCK_GEO_COORDINATES,
};

export const MOCK_WEATHER_AUTOMATION_DATA: ESPAutomationInterface = {
  automationName: "Mock Weather Automation",
  automationId: "mock_weather_automation_id",
  enabled: true,
  eventType: ESPAutomationEventType.Weather,
  events: [
    {
      param: ESPWeatherParameter.Temperature,
      value: "25",
      check: ESPAutomationConditionOperator.GREATER_THAN,
    } as ESPWeatherEvent,
  ],
  eventOperator: ESPAutomationEventOperator.AND,
  actions: [MOCK_AUTOMATION_ACTION],
  retrigger: false,
  location: MOCK_GEO_COORDINATES,
};

// Update details for different automation types
export const MOCK_AUTOMATION_UPDATE_DETAILS: ESPAutomationUpdateDetails = {
  name: "Updated Test Automation",
  actions: [MOCK_AUTOMATION_ACTION],
  events: [MOCK_AUTOMATION_EVENT],
};

export const MOCK_DAYLIGHT_AUTOMATION_UPDATE_DETAILS: ESPAutomationUpdateDetails =
  {
    name: "Updated Daylight Automation",
    events: [ESPDaylightEvent.Sunset],
    actions: [MOCK_AUTOMATION_ACTION],
    location: {
      latitude: "13.0827",
      longitude: "80.2707",
    },
  };

export const MOCK_WEATHER_AUTOMATION_UPDATE_DETAILS: ESPAutomationUpdateDetails =
  {
    name: "Updated Weather Automation",
    events: [
      {
        param: ESPWeatherParameter.Humidity,
        value: "80",
        check: ESPAutomationConditionOperator.LESS_THAN,
      } as ESPWeatherEvent,
    ],
    actions: [MOCK_AUTOMATION_ACTION],
    location: {
      latitude: "19.0760",
      longitude: "72.8777",
    },
  };

export const MOCK_WEATHER_CONDITION_UPDATE_DETAILS: ESPAutomationUpdateDetails =
  {
    name: "Updated Weather Condition Automation",
    events: [ESPWeatherCondition.Rain, ESPWeatherCondition.Snow],
    actions: [MOCK_AUTOMATION_ACTION],
    location: {
      latitude: "19.0760",
      longitude: "72.8777",
    },
  };

// Create automation instances for different types
export const MOCK_AUTOMATION = new ESPAutomation(MOCK_AUTOMATION_DATA);
export const MOCK_DAYLIGHT_AUTOMATION = new ESPAutomation(
  MOCK_DAYLIGHT_AUTOMATION_DATA
);
export const MOCK_WEATHER_AUTOMATION = new ESPAutomation(
  MOCK_WEATHER_AUTOMATION_DATA
);

/**
 * Mock responses for automation operations
 */
export const MOCK_AUTOMATION_RESPONSE = {
  /**
   * Mock response for adding an automation
   */
  ADD_AUTOMATION_SUCCESS: {
    automation_id: MOCK_AUTOMATION_ID,
    status: StatusMessage.SUCCESS,
  } as ESPRawAutomationResponse,
  /**
   * Mock response for getting automations
   */
  GET_AUTOMATIONS_SUCCESS: {
    automation_trigger_actions: [
      {
        name: "Mock Automation",
        automation_id: MOCK_AUTOMATION_ID,
        enabled: true,
        node_id: MOCK_NODE_ID,
        event_type: ESPAutomationEventType.NodeParams,
        metadata: {},
        events: [],
        event_operator: ESPAutomationEventOperator.AND,
        actions: [],
        retrigger: false,
      },
    ],
    next_id: null,
  },
  /**
   * Mock response for getting an automation detail
   */
  GET_AUTOMATION_DETAIL_SUCCESS: {
    name: "Mock Automation",
    automation_id: MOCK_AUTOMATION_ID,
    enabled: true,
    node_id: MOCK_NODE_ID,
    event_type: ESPAutomationEventType.NodeParams,
    metadata: {},
    events: [],
    event_operator: ESPAutomationEventOperator.AND,
    actions: [],
    retrigger: false,
  },

  /**
   * Mock response for getting geo coordinates
   */
  GET_GEO_COORDINATES_SUCCESS: {
    [Keys.GEO_COORDINATES]: {
      value: {
        latitude: "12.9716",
        longitude: "77.5946",
      },
    },
  },

  /**
   * Mock response for setting geo coordinates
   */
  SET_GEO_COORDINATES_SUCCESS: {
    status: StatusMessage.SUCCESS,
    description: "Geo coordinates set successfully",
  } as ESPAPIResponse,

  /**
   * Mock response for deleting an automation
   */
  DELETE_AUTOMATION_SUCCESS: {
    status: StatusMessage.SUCCESS,
    description: "Automation deleted successfully",
  } as ESPAPIResponse,

  /**
   * Mock response for enabling an automation
   */
  ENABLE_AUTOMATION_SUCCESS: {
    status: StatusMessage.SUCCESS,
    description: "Automation enabled successfully",
  } as ESPAPIResponse,

  /**
   * Mock response for disabling an automation
   */
  DISABLE_AUTOMATION_SUCCESS: {
    status: StatusMessage.SUCCESS,
    description: "Automation disabled successfully",
  } as ESPAPIResponse,

  /**
   * Mock response for setting retrigger
   */
  SET_RETRIGGER_SUCCESS: {
    status: StatusMessage.SUCCESS,
    description: "Retrigger set successfully",
  } as ESPAPIResponse,

  /**
   * Mock response for updating actions
   */
  UPDATE_ACTIONS_SUCCESS: {
    status: StatusMessage.SUCCESS,
    description: "Actions updated successfully",
  } as ESPAPIResponse,

  /**
   * Mock response for updating automation
   */
  UPDATE_AUTOMATION_SUCCESS: {
    status: StatusMessage.SUCCESS,
    description: "Automation updated successfully",
  } as ESPAPIResponse,

  /**
   * Mock response for updating events
   */
  UPDATE_EVENTS_SUCCESS: {
    status: StatusMessage.SUCCESS,
    description: "Events updated successfully",
  } as ESPAPIResponse,

  /**
   * Mock response for updating location
   */
  UPDATE_LOCATION_SUCCESS: {
    status: StatusMessage.SUCCESS,
    description: "Location updated successfully",
  } as ESPAPIResponse,

  /**
   * Mock response for updating name
   */
  UPDATE_NAME_SUCCESS: {
    status: StatusMessage.SUCCESS,
    description: "Name updated successfully",
  } as ESPAPIResponse,
};

/**
 * Sets up the test environment for automation tests
 * @returns Test setup object containing instances needed for tests
 */
export async function setupAutomationTestEnvironment() {
  const authInstance = configureAuthInstance();
  const userInstance = await authInstance.login(
    process.env.USERNAME!,
    process.env.PASSWORD!
  );

  return userInstance;
}
/**
 * Cleans up the test environment
 * @param authInstance Auth instance to cleanup
 * @param userInstance User instance to cleanup
 */
export async function cleanupAutomationTestEnvironment(
  userInstance: ESPRMUser
): Promise<void> {
  try {
    await userInstance.logout();
  } catch (error) {
    console.warn("Cleanup: Logout failed or no user was logged in");
  }
}
