/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPGroupSharingUserInfo } from "./ESPGroupSharingUserInfo";
import { ESPGroupSharingInfoInterface } from "./types/input";

/**
 * Represents the sharing information of a group.
 *
 * This class stores details about a group's sharing configuration, including the users associated with the group
 * (both primary and secondary users), as well as the subgroups and parent groups related to the group.
 */
export class ESPGroupSharingInfo implements ESPGroupSharingInfoInterface {
  /**
   * The unique identifier for the group.
   */
  groupId: string;

  /**
   * A flag indicating whether the group is mutually exclusive in terms of sharing.
   */
  mutuallyExclusive: boolean;

  /**
   * The list of primary users associated with the group.
   * Each user is represented by an instance of `ESPGroupSharingUserInfo`.
   */
  primaryUsers?: ESPGroupSharingUserInfo[];

  /**
   * The list of secondary users associated with the group.
   * Each user is represented by an instance of `ESPGroupSharingUserInfo`.
   */
  secondaryUsers?: ESPGroupSharingUserInfo[];

  /**
   * Information about subgroups related to the group.
   * Each subgroup is represented by an instance of `ESPGroupSharingInfo`.
   */
  subGroupsInfo?: ESPGroupSharingInfo[];

  /**
   * Information about parent groups related to the group.
   * Each parent group is represented by an instance of `ESPGroupSharingInfo`.
   */
  parentGroupsInfo?: ESPGroupSharingInfo[];

  /**
   * Creates an instance of `ESPGroupSharingInfo`.
   *
   * @param config - The configuration object that contains the information to initialize the group sharing info.
   */
  constructor(config: ESPGroupSharingInfoInterface) {
    this.groupId = config.groupId;
    this.mutuallyExclusive = config.mutuallyExclusive;
    this.primaryUsers = config.primaryUsers?.map(
      (primaryUser) => new ESPGroupSharingUserInfo(primaryUser)
    );
    this.secondaryUsers = config.secondaryUsers?.map(
      (secondaryUser) => new ESPGroupSharingUserInfo(secondaryUser)
    );
    this.subGroupsInfo = config.subGroupsInfo?.map(
      (subGroup) => new ESPGroupSharingInfo(subGroup)
    );
    this.parentGroupsInfo = config.parentGroupsInfo?.map(
      (parentGroup) => new ESPGroupSharingInfo(parentGroup)
    );
  }
}
