/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMServiceParam } from "../../ESPRMServiceParam";
import { delegatedTransportHandler } from "../../services/ESPRMHelpers/DelegatedTransportHandler";
import { ESPAPIResponse } from "../../types/output";
import { APICallValidationErrorCodes } from "../../utils/constants";
import { ESPAPICallValidationError } from "../../utils/error/Error";

/**
 * Augments the ESPRMServiceParam class with the `setValue` method.
 */
declare module "../../ESPRMServiceParam" {
  interface ESPRMServiceParam {
    /**
     * Sets the value of the service parameter.
     *
     * @param value - The new value to set for the service parameter.
     * @returns A promise that resolves to the success response from the API.
     */
    setValue(value: any): Promise<ESPAPIResponse>;
  }
}

ESPRMServiceParam.prototype.setValue = async function (
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
      [this.serviceName]: {
        [this.name]: value,
      },
    },
  };

  return (delegatedTransportHandler<ESPAPIResponse>).call(node, (manager) =>
    manager.setParam(payload)
  );
};
