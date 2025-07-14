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
import { ESPDiscoveryProtocol } from "../../types/discovery";
import { ESPRMEventType } from "../../types/subscription";
import { ESPTransportMode } from "../../types/transport";
import { APICallValidationErrorCodes } from "../../utils/constants";
import { ESPAPICallValidationError } from "../../utils/error/Error";

/**
 * Augments the ESPRMUser class with methods for subscribing to and managing event callbacks.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Subscribes a callback function or an array of callback functions to a specified event.
     *
     * @param event - The event to subscribe to, represented by {@link ESPRMEventType}.
     * @param callback - The callback function or an array of callback functions to execute when the event is triggered.
     * @throws An error if the event type is invalid.
     */
    subscribe(event: ESPRMEventType, callback: Function | Function[]): void;

    /**
     * Unsubscribes a specific callback function from a specified event.
     *
     * @param event - The event to unsubscribe from, represented by {@link ESPRMEventType}.
     * @param callback - The callback function to remove.
     */
    unsubscribe(event: ESPRMEventType, callback: Function): void;

    /**
     * Triggers an event and executes all associated callback functions with the provided argument.
     *
     * @param event - The event to trigger, represented by {@link ESPRMEventType}.
     * @param arg - The argument to pass to the callback functions.
     */
    trigger(event: ESPRMEventType, arg: any): void;

    /**
     * Removes all callbacks for a specified event or all events.
     *
     * @param event - (Optional) The event for which to remove callbacks. If omitted, all callbacks for all events are removed.
     */
    removeAllCallbacks(event?: ESPRMEventType): void;
  }
}

/**
 * Subscribes a callback or multiple callbacks to an event. If the event is of type `Local`,
 * discovery will be initiated with the callback triggered for discovered results.
 *
 * @param event - The event to subscribe to, represented by {@link ESPRMEventType}.
 * @param callback - The callback function or an array of callback functions to execute when the event is triggered.
 * @throws An error if the provided event type is invalid.
 */
ESPRMUser.prototype.subscribe = function (
  event: ESPRMEventType,
  callback: Function | Function[]
): void {
  if (!isValidEnumValue(event, ESPRMEventType)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.INVALID_EVENT_TYPE
    );
  }

  if (!this.eventCallbacks[event]) {
    this.eventCallbacks[event] = [];
  }

  if (Array.isArray(callback)) {
    this.eventCallbacks[event].push(...callback);
  } else {
    this.eventCallbacks[event].push(callback);
  }

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

  const notificationCallback = (info: Record<string, any>) => {
    const notificationData = transformNotificationData(info);
    if (notificationData) {
      this.trigger(event, notificationData);
    }
  };

  if (event === ESPRMEventType.localDiscovery) {
    const localDiscoveryManager = new ESPDiscoveryManager(
      ESPDiscoveryProtocol.local
    );
    localDiscoveryManager.startDiscovery(discoveryCallback);
  }

  if (event === ESPRMEventType.nodeUpdates) {
    ESPRMBase.ESPNotificationAdapter.addNotificationListener(
      notificationCallback
    );
  }
};

/**
 * Removes a specific callback function from a specified event.
 *
 * @param event - The event to unsubscribe from, represented by {@link ESPRMEventType}.
 * @param callback - The callback function to remove from the event.
 */
ESPRMUser.prototype.unsubscribe = function (
  event: ESPRMEventType,
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
 * @param event - The event to trigger, represented by {@link ESPRMEventType}.
 * @param arg - The argument to pass to the callback functions.
 */
ESPRMUser.prototype.trigger = function (event: ESPRMEventType, arg: any): void {
  this.eventCallbacks[event]?.forEach((cb) => cb(arg));
};

/**
 * Removes all registered callbacks for a specified event or for all events if no event is specified.
 *
 * @param event - (Optional) The event for which to remove all callbacks. If not provided, all events' callbacks are cleared.
 */
ESPRMUser.prototype.removeAllCallbacks = function (
  event?: ESPRMEventType
): void {
  if (event) {
    if (!this.eventCallbacks[event]) return;
    delete this.eventCallbacks[event];
    return;
  }
  for (const event in this.eventCallbacks) {
    const eventKey = event as ESPRMEventType;
    delete this.eventCallbacks[eventKey];
  }
};
