/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPGroupSharingUserInfoInterface } from "./types/input";

/**
 * Represents user information related to group sharing.
 *
 * This class holds the details of a user in the context of group sharing, including the user's name
 * and any associated metadata that provides additional context about the user.
 */
export class ESPGroupSharingUserInfo
  implements ESPGroupSharingUserInfoInterface
{
  /**
   * The username of the user associated with the group sharing.
   */
  username: string;

  /**
   * Optional metadata associated with the user in the context of group sharing.
   */
  metadata?: Record<string, any> | undefined;

  /**
   * Creates an instance of `ESPGroupSharingUserInfo` with the specified configuration.
   *
   * @param config - The configuration object containing the properties to initialize the user info.
   */
  constructor(config: ESPGroupSharingUserInfoInterface) {
    this.username = config.username;
    this.metadata = config.metadata;
  }
}
