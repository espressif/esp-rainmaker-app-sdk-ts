/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMDevice } from "../../ESPRMDevice";
import { ESPRMDeviceParam } from "../../ESPRMDeviceParam";
import { delegatedTransportHandler } from "../../services/ESPRMHelpers/DelegatedTransportHandler";
import { APICallValidationErrorCodes } from "../../utils/constants";
import { ESPAPICallValidationError } from "../../utils/error/Error";

/**
 * Augments the ESPRMDevice class with the `getParams` method.
 */
declare module "../../ESPRMDevice" {
  interface ESPRMDevice {
    /**
     * Fetches the parameters for the current device.
     *
     * @returns {Promise<ESPRMDeviceParam[]>} A promise that resolves to an array of updated device parameters.
     */
    getParams(): Promise<ESPRMDeviceParam[]>;
  }
}

/**
 * Fetches the parameters for the current device using its nodeId.
 *
 * @returns {Promise<ESPRMDeviceParam[]>} A promise that resolves to an array of updated parameters.
 */
ESPRMDevice.prototype.getParams = async function (): Promise<
  ESPRMDeviceParam[]
> {
  let response;
  const node = this.nodeRef.deref();
  if (!node) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.DEVICE_LIST_REFRESH_REQUIRED
    );
  }

  const payload = {
    node_id: node.id,
  };

  response = await (delegatedTransportHandler<Record<string, any>>).call(
    node,
    (manager) => manager.getParams(payload)
  );

  const currentDeviceSpecificParamsData = response![this.name];

  const updatedESPRMDeviceParamsList = this.params?.map((param) => {
    const _param = { ...param };
    _param.value = currentDeviceSpecificParamsData[_param.name];
    return new ESPRMDeviceParam(_param, node!);
  });

  return updatedESPRMDeviceParamsList!;
};
