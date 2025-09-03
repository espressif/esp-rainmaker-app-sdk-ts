/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../ESPRMNode";
import { ESPTransportManager } from "../../services/ESPTransport/ESPTransportManager";
import { ESPTransportConfig, ESPTransportMode } from "../../types/transport";
import {
  APICallValidationErrorCodes,
  ESPServiceParamType,
  ESPServiceType,
} from "../../utils/constants";
import { ESPAPICallValidationError } from "../../utils/error/Error";

/**
 * A generic handler for delegated transport operations.
 *
 * This method provides a mechanism to perform transport operations, such as retrieving or
 * setting device parameters, using an instance of `ESPTransportManager`. The specific
 * operation to be performed is provided as a callback function.
 *
 * @typeParam T - The type of the result returned by the transport operation.
 * @param operation - A function that performs the transport operation. It receives an
 * instance of `ESPTransportManager` and returns a promise resolving to the result of the operation.
 * @returns A promise that resolves to the result of the transport operation.
 * @throws Error if the node is offline or if all transport methods fail.
 */

const delegatedTransportHandler = async function <T>(
  this: ESPRMNode,
  operation: (manager: ESPTransportManager) => Promise<T>
): Promise<T> {
  let errorInstance;
  let success = false;
  let result: T;
  let securityType;
  let pop;

  if (
    this.transportOrder.length === 0 ||
    Object.keys(this.availableTransports).length === 0
  ) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.NODE_UNREACHABLE
    );
  }

  const localCtrlService = this.nodeConfig?.services?.find((service) => {
    return service.type === ESPServiceType.LOCAL_CONTROL;
  });

  localCtrlService?.params.forEach((param) => {
    if (param.type === ESPServiceParamType.LOCAL_CONTROL.TYPE) {
      securityType = param.value;
    }
    if (param.type === ESPServiceParamType.LOCAL_CONTROL.POP) {
      pop = param.value;
    }
  });

  for (let i = 0; i < this.transportOrder.length; i++) {
    const transportMode = this.transportOrder[i];
    let config: ESPTransportConfig =
      this.availableTransports[
        transportMode as keyof typeof this.availableTransports
      ];

    if (config) {
      if (transportMode === ESPTransportMode.local) {
        if (!config.metadata.baseUrl) {
          throw new ESPAPICallValidationError(
            APICallValidationErrorCodes.MISSING_BASE_URL
          );
        }
        config.metadata.securityType = securityType || 0;
        if (securityType === 1 || securityType === 2) {
          config.metadata.pop = pop;
        }
      }
      try {
        const transportManager = new ESPTransportManager(config);
        result = await operation(transportManager);
        success = true;
        break;
      } catch (error: any) {
        errorInstance = error;
      }
    } else {
      continue;
    }
  }

  if (!success) {
    throw errorInstance;
  }

  return result!;
};

export { delegatedTransportHandler };
