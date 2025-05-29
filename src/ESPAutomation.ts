/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ESPAutomationInterface,
  ESPAutomationEvent,
  ESPAutomationAction,
  ESPAutomationEventType,
  ESPAutomationEventOperator,
  ESPWeatherEvent,
  ESPDaylightEvent,
  ESPGeoCoordinates,
  ESPWeatherCondition,
} from "./types/automation";

/**
 * Class representing an automation in the ESP RainMaker system.
 * This class implements the ESPAutomationInterface.
 */
export class ESPAutomation implements ESPAutomationInterface {
  /** The name of the automation. */
  automationName: string;

  /** The unique identifier of the automation. */
  automationId: string;

  /** Indicates whether the automation is currently enabled. */
  enabled: boolean;

  /** The ID of the node associated with this automation. */
  nodeId?: string;

  /** The type of events that trigger this automation. */
  eventType: ESPAutomationEventType;

  /** Additional metadata associated with the automation. */
  metadata?: any;

  /** The list of events that trigger this automation. */
  events: (
    | ESPAutomationEvent
    | ESPWeatherEvent
    | ESPWeatherCondition
    | ESPDaylightEvent
  )[];

  /** The operator used to combine multiple events (AND/OR). */
  eventOperator: ESPAutomationEventOperator;

  /** The list of actions to be performed when the automation is triggered. */
  actions: ESPAutomationAction[];

  /** Indicates whether the automation should be retriggered after completion. */
  retrigger?: boolean;

  /** The geographical coordinates for weather/daylight based automations. */
  location?: ESPGeoCoordinates;

  /** The region for weather/daylight based automations. */
  region?: string;

  /**
   * Creates a new instance of ESPAutomation.
   *
   * @param automationConfig - The configuration object for the automation
   */
  constructor(automationConfig: ESPAutomationInterface) {
    this.automationName = automationConfig.automationName;
    this.automationId = automationConfig.automationId;
    this.enabled = automationConfig.enabled;
    this.nodeId = automationConfig.nodeId;
    this.eventType = automationConfig.eventType;
    this.metadata = automationConfig.metadata;
    this.events = automationConfig.events;
    this.eventOperator = automationConfig.eventOperator;
    this.actions = automationConfig.actions;
    this.retrigger = automationConfig.retrigger;
    this.location = automationConfig.location;
    this.region = automationConfig.region;
  }
}
