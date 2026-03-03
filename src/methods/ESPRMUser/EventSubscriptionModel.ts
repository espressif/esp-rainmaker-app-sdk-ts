/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase } from "../../ESPRMBase";
import { ESPRMUser } from "../../ESPRMUser";
import { isValidEnumValue } from "../../services/ESPRMHelpers/IsValidEnumValue";
import { transformNotificationData } from "../../services/ESPRMHelpers/TransformNotificationData";
import { ESPDiscoveryManager } from "../../services/ESPTransport/ESPDiscovery/ESPDiscoveryManager";
import { DiscoveryParamsInterface } from "../../types";
import { ESPRMEventType } from "../../types/subscription";
import { ESPTransportMode } from "../../types/transport";
import { isObjectEmpty } from "../../utils/export";

/**
 * Augments the ESPRMUser class with methods for subscribing to and managing event callbacks.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Subscribes a callback function or an array of callback functions to a specified event.
     *
     * @param event - The event to subscribe to, represented by {@link ESPRMEventType} or string.
     * @param callback - The callback function or an array of callback functions to execute when the event is triggered.
     * @param discoveryConfig - The discovery configuration to use for the custom discovery protocol.
     * @throws An error if the event type is invalid.
     */
    subscribe(
      event: ESPRMEventType | string,
      callback: Function | Function[],
      discoveryConfig?: DiscoveryParamsInterface
    ): void;

    /**
     * Unsubscribes a specific callback function from a specified event.
     *
     * @param event - The event to unsubscribe from, represented by {@link ESPRMEventType} or string.
     * @param callback - The callback function to remove.
     */
    unsubscribe(event: ESPRMEventType | string, callback: Function): void;

    /**
     * Triggers an event and executes all associated callback functions with the provided argument.
     *
     * @param event - The event to trigger, represented by {@link ESPRMEventType} or string.
     * @param arg - The argument to pass to the callback functions.
     */
    trigger(event: ESPRMEventType | string, arg: any): void;

    /**
     * Removes all callbacks for a specified event or all events.
     *
     * @param event - (Optional) The event for which to remove callbacks. If omitted, all callbacks for all events are removed.
     */
    removeAllCallbacks(event?: ESPRMEventType | string): void;
  }
}

/**
 * Subscribes a callback or multiple callbacks to an event. If the event is of type `Local`,
 * discovery will be initiated with the callback triggered for discovered results.
 *
 * @param event - The event to subscribe to, represented by {@link ESPRMEventType} or string.
 * @param callback - The callback function or an array of callback functions to execute when the event is triggered.
 * @param discoveryConfig - The discovery configuration to use for the event.
 * @throws An error if the provided event type is invalid.
 */
ESPRMUser.prototype.subscribe = function (
  event: ESPRMEventType | string,
  callback: Function | Function[],
  discoveryConfig?: DiscoveryParamsInterface
): void {
  if (!this.eventCallbacks[event]) {
    this.eventCallbacks[event] = [];
  }

  if (Array.isArray(callback)) {
    this.eventCallbacks[event].push(...callback);
  } else {
    this.eventCallbacks[event].push(callback);
  }

  /**
   * Handles the data received from the local discovery protocol.
   * Transform the data to the expected format to update the node availabeTransports config and
   * trigger the callback function registered for the local discovery event.
   */
  const discoveryCallback = (info: Record<string, any>) => {
    const discoveredNodeData = {
      nodeId: info.nodeId,
      transportDetails: {
        type: ESPTransportMode.local,
        metadata: {
          baseUrl: info.baseUrl,
        },
      },
    };
    this.trigger(event, discoveredNodeData);
  };

  /**
   * Handles the data received from the custom discovery protocol.
   * Pass the raw data to the event subscribed callback function registered for the custom discovery event.
   * It is the responsibility of the callback function to transform the data as per protocol requirements
   * and update the node availabeTransports config.
   */
  const customDiscoveryProtocolDataHandler = (info: Record<string, any>) => {
    this.trigger(event, info);
  };

  const notificationCallback = (info: Record<string, any>) => {
    const notificationData = transformNotificationData(info);
    if (notificationData) {
      this.trigger(event, notificationData);
    }
  };

  if (event === ESPRMEventType.localDiscovery) {
    /**
     * Start the local discovery process using the default local discovery config.
     */
    const localDiscoveryManager = new ESPDiscoveryManager();
    localDiscoveryManager.startDiscovery(discoveryCallback);
  }
  if (event === ESPRMEventType.nodeUpdates) {
    ESPRMBase.ESPNotificationAdapter.addNotificationListener(
      notificationCallback
    );
  }
  /**
   * If the event is a string other than ESPRMEventType enum value,
   * and discoveryConfig is provided,
   * start the discovery process using the custom discovery config
   */
  if (
    !isValidEnumValue(event, ESPRMEventType) &&
    !isObjectEmpty(discoveryConfig || {})
  ) {
    /**
     * Start the discovery process using the custom discovery config.
     */
    const customDiscoveryManager = new ESPDiscoveryManager(discoveryConfig);
    customDiscoveryManager.startDiscovery(customDiscoveryProtocolDataHandler);
  }
};

/**
 * Removes a specific callback function from a specified event.
 *
 * @param event - The event to unsubscribe from, represented by {@link ESPRMEventType} or string.
 * @param callback - The callback function to remove from the event.
 */
ESPRMUser.prototype.unsubscribe = function (
  event: ESPRMEventType | string,
  callback: Function
): void {
  if (!this.eventCallbacks[event]) return;
  this.eventCallbacks[event] = this.eventCallbacks[event].filter(
    (cb) => cb !== callback
  );
};

/**
 * Triggers an event, executing all associated callbacks with the provided argument.
 *
 * @param event - The event to trigger, represented by {@link ESPRMEventType} or string.
 * @param arg - The argument to pass to the callback functions.
 */
ESPRMUser.prototype.trigger = function (
  event: ESPRMEventType | string,
  arg: any
): void {
  this.eventCallbacks[event]?.forEach((cb) => cb(arg));
};

/**
 * Removes all registered callbacks for a specified event or for all events if no event is specified.
 *
 * @param event - (Optional) The event for which to remove all callbacks. If not provided, all events' callbacks are cleared.
 */
ESPRMUser.prototype.removeAllCallbacks = function (
  event?: ESPRMEventType | string
): void {
  if (event) {
    if (!this.eventCallbacks[event]) return;
    delete this.eventCallbacks[event];
    return;
  }
  for (const event in this.eventCallbacks) {
    const eventKey = event as ESPRMEventType | string;
    delete this.eventCallbacks[eventKey];
  }
};
