/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMDeviceParam } from "../../ESPRMDeviceParam";
import { delegatedTransportHandler } from "../../services/ESPRMHelpers/DelegatedTransportHandler";
import { ESPAPIResponse } from "../../types/output";
import { APICallValidationErrorCodes } from "../../utils/constants";
import { ESPAPICallValidationError } from "../../utils/error/Error";

/**
 * Augments the ESPRMDeviceParam class with the `setValue` method.
 */
declare module "../../ESPRMDeviceParam" {
  interface ESPRMDeviceParam {
    /**
     * Sets the value of the device parameter.
     *
     * @param value - The new value to set for the device parameter.
     * @returns A promise that resolves to the success response from the API.
     */
    setValue(value: any): Promise<ESPAPIResponse>;
  }
}

ESPRMDeviceParam.prototype.setValue = async function (
  value: any
): Promise<ESPAPIResponse> {
  const node = this.nodeRef.deref();
  if (!node) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.DEVICE_LIST_REFRESH_REQUIRED
    );
  }

  if (this.validStrings && !this.validStrings.includes(value)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.INVALID_PARAMETER_VALUE
    );
  }

  const payload = {
    node_id: node.id,
    payload: {
      [this.deviceName]: {
        [this.name]: value,
      },
    },
  };

  return (delegatedTransportHandler<ESPAPIResponse>).call(node, (manager) =>
    manager.setParam(payload, node)
  );
};
