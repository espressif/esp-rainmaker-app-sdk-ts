/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAutomation } from "../ESPAutomation";

/**
 * Enum representing the operators for automation conditions
 */
enum ESPAutomationConditionOperator {
  EQUAL = "==",
  NOT_EQUAL = "!=",
  LESS_THAN = "<",
  LESS_THAN_OR_EQUAL = "<=",
  GREATER_THAN = ">",
  GREATER_THAN_OR_EQUAL = ">=",
}

/**
 * Enum representing the operators for combining automation events
 */
enum ESPAutomationEventOperator {
  AND = "and",
  OR = "or",
}

/**
 * Enum representing the types of automation events
 */
enum ESPAutomationEventType {
  NodeParams = "node_params",
  Weather = "weather",
  Daylight = "daylight",
}

/**
 * Enum representing weather parameters for automation
 */
enum ESPWeatherParameter {
  Temperature = "temperature",
  Pressure = "pressure",
  Humidity = "humidity",
  WindSpeed = "wind_speed",
}

/**
 * Enum representing weather conditions for automation
 */
enum ESPWeatherCondition {
  Thunderstorm = "Thunderstorm",
  Drizzle = "Drizzle",
  Rain = "Rain",
  Snow = "Snow",
  Clear = "Clear",
  Clouds = "Clouds",
  Mist = "Mist",
  Smoke = "Smoke",
  Haze = "Haze",
  Dust = "Dust",
  Fog = "Fog",
  Sand = "Sand",
  Ash = "Ash",
  Squall = "Squall",
  Tornado = "Tornado",
}

/**
 * Interface representing an automation event
 */
interface ESPAutomationEvent {
  deviceName: string;
  param: string;
  value: any;
  check: ESPAutomationConditionOperator;
}

/**
 * Interface representing a weather event
 */
interface ESPWeatherEvent {
  param: ESPWeatherParameter;
  value: number | string;
  check: ESPAutomationConditionOperator;
}

/**
 * Interface representing an automation action
 */
interface ESPAutomationAction {
  nodeId: string;
  deviceName: string;
  param: string;
  value: any;
}

/**
 * Interface representing automation details
 */
interface ESPAutomationDetails {
  name: string;
  metadata?: any;
  events: ESPAutomationEvent[];
  eventOperator: ESPAutomationEventOperator;
  retrigger: boolean;
  actions: ESPAutomationAction[];
}

/**
 * Interface representing automation update details
 * All fields are optional as only specific fields need to be updated
 */
interface ESPAutomationUpdateDetails {
  name?: string;
  nodeId?: string;
  metadata?: any;
  events?: (
    | ESPAutomationEvent
    | ESPWeatherEvent
    | ESPWeatherCondition
    | ESPDaylightEvent
  )[];
  eventOperator?: ESPAutomationEventOperator;
  retrigger?: boolean;
  actions?: ESPAutomationAction[];
  enabled?: boolean;
  location?: ESPGeoCoordinates;
}

/**
 * Interface representing geographical coordinates
 */
interface ESPGeoCoordinates {
  latitude: string;
  longitude: string;
}

/**
 * Interface representing weather-based automation details
 */
interface ESPWeatherAutomationDetails {
  name: string;
  metadata?: any;
  location?: ESPGeoCoordinates;
  events: (ESPWeatherEvent | ESPWeatherCondition)[];
  eventOperator: ESPAutomationEventOperator;
  retrigger: boolean;
  actions: ESPAutomationAction[];
}

/**
 * Interface representing an automation
 */
interface ESPAutomationInterface {
  automationName: string;
  automationId: string;
  enabled: boolean;
  eventType: ESPAutomationEventType;
  events: (
    | ESPAutomationEvent
    | ESPWeatherEvent
    | ESPWeatherCondition
    | ESPDaylightEvent
  )[];
  eventOperator: ESPAutomationEventOperator;
  actions: ESPAutomationAction[];
  nodeId?: string;
  metadata?: any;
  retrigger?: boolean;
  location?: ESPGeoCoordinates;
  region?: string;
}

/**
 * Interface representing the raw response from the automation API
 */
interface ESPRawAutomationResponse {
  automation_id: string;
  status: string;
}

/**
 * Enum representing daylight event
 */
enum ESPDaylightEvent {
  Sunrise = "sunrise",
  Sunset = "sunset",
}

/**
 * Interface representing daylight automation details
 */
interface ESPDaylightAutomationDetails {
  name: string;
  metadata?: any;
  location?: ESPGeoCoordinates;
  events: ESPDaylightEvent[];
  eventOperator: ESPAutomationEventOperator;
  retrigger: boolean;
  actions: ESPAutomationAction[];
}

/**
 * Interface for paginated response containing automation data
 */
interface ESPPaginatedAutomationsResponse {
  /** List of automations in the current page */
  automations: ESPAutomation[];
  /** Indicates if there are more pages available */
  hasNext: boolean;
  /** Function to fetch the next page of automations */
  fetchNext?: () => Promise<ESPPaginatedAutomationsResponse>;
}

export {
  ESPAutomationConditionOperator,
  ESPAutomationEventOperator,
  ESPAutomationEventType,
  ESPWeatherParameter,
  ESPWeatherCondition,
  ESPAutomationEvent,
  ESPWeatherEvent,
  ESPAutomationAction,
  ESPAutomationDetails,
  ESPAutomationUpdateDetails,
  ESPGeoCoordinates,
  ESPWeatherAutomationDetails,
  ESPAutomationInterface,
  ESPRawAutomationResponse,
  ESPDaylightEvent,
  ESPDaylightAutomationDetails,
  ESPPaginatedAutomationsResponse,
};
