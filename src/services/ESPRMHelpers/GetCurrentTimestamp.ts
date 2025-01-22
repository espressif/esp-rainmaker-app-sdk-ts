/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Gets the current timestamp in seconds since the Unix epoch.
 *
 * @returns The current timestamp in seconds.
 */
const getCurrentTimestamp = (): number => {
  return Math.floor(new Date().getTime() / 1000);
};

export { getCurrentTimestamp };
