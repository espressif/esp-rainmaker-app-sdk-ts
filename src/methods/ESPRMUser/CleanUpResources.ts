/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMStorage } from "../../services/ESPRMStorage/ESPRMStorage";
import { StorageKeys } from "../../utils/constants";

declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Cleans up resources associated with the user.
     *
     * This method retrieves the device token map from storage, deletes the endpoint associated with the user's device token,
     * and clears all tokens from storage.
     *
     * @returns A promise that resolves when the resources are cleaned up.
     */
    cleanUpResources(): Promise<void>;
  }
}

/**
 * Cleans up resources associated with the user.
 *
 * This method retrieves the device token map from storage, deletes the endpoint associated with the user's device token,
 * and clears all tokens from storage.
 *
 * @returns A promise that resolves when the resources are cleaned up.
 */
ESPRMUser.prototype.cleanUpResources = async function (): Promise<void> {
  const userDeviceTokenMap = await ESPRMStorage.getItem(
    StorageKeys.USER_DEVICETOKEN_MAP
  );
  if (userDeviceTokenMap) {
    const parsedUserDeviceTokenMap = JSON.parse(userDeviceTokenMap);
    const deviceToken = parsedUserDeviceTokenMap[ESPRMUser.userId];
    await this.deleteEndpoint(deviceToken);
  }
  ESPRMStorage.removeItem(StorageKeys.USER_DEVICETOKEN_MAP);
  ESPRMUser.clearAllTokens();
};
