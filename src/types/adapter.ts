/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

interface ESPNotificationAdapterInterface {
  /**
   * Retrieves delivered notifications.
   * @param callback - The function to call with the delivered notifications.
   */
  addNotificationListener(callback: Function): void;
}

interface ESPOauthAdapterInterface {
  /**
   * Retrieve the OAuth code by opening the request URL
   * in a new browser window and handles the listening for the code at the redirect URL
   * and returns the code.
   *
   * @param requestURL - The request URL to open in a new browser window.
   * @returns The OAuth code.
   */
  getOauthCode(requestURL: string): Promise<string>;
}

/**
 * Interface for the app utility adapter.
 */
interface ESPAppUtilityAdapterInterface {
  /**
   * Checks if Bluetooth Low Energy (BLE) permission is granted.
   */
  isBlePermissionGranted(): Promise<boolean>;

  /**
   * Checks if location permission is granted.
   */
  isLocationPermissionGranted(): Promise<boolean>;
}

export {
  ESPNotificationAdapterInterface,
  ESPOauthAdapterInterface,
  ESPAppUtilityAdapterInterface,
};
