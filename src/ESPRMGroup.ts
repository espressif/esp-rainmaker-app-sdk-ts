/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "./ESPRMNode";
import { ESPRMGroupInterface } from "./types/input";

/**
 * Represents a user group in the system, responsible for managing group-related information and associated nodes.
 *
 * The `ESPRMGroup` class holds details about the group such as its name, ID, associated nodes, subgroups, and additional properties
 * like metadata and custom data.
 */
export class ESPRMGroup implements ESPRMGroupInterface {
  /**
   * The name of the group.
   */
  name: string;

  /**
   * The unique identifier of the group.
   */
  id: string;

  /**
   * Indicates whether the group is a primary user group.
   */
  isPrimaryUser?: boolean;

  /**
   * The total number of nodes in the group.
   */
  totalNodes?: number;

  /**
   * The ID of the parent group.
   */
  parentGroupId?: string;

  /**
   * The type of the group (e.g., "admin", "user").
   */
  type?: string;

  /**
   * Indicates whether the group has mutually exclusive users.
   */
  mutuallyExclusive?: boolean;

  /**
   * A list of node IDs associated with the group.
   */
  nodes?: string[];

  /**
   * A list of `ESPRMNode` instances representing the nodes in the group.
   */
  nodeDetails?: ESPRMNode[];

  /**
   * A list of subgroups within this group.
   */
  subGroups?: ESPRMGroup[];

  /**
   * A description of the group.
   */
  description?: string;

  /**
   * Additional metadata associated with the group.
   */
  metadata?: Record<string, any>;

  /**
   * Custom data associated with the group.
   */
  customData?: Record<string, any>;

  /**
   * Indicates whether the group is a Matter-enabled group.
   */
  isMatter?: boolean;

  /**
   * The fabric ID associated with the group.
   */
  fabricId?: string;

  /**
   * Creates an instance of `ESPRMGroup` with the specified configuration.
   *
   * @param config - The configuration object containing the properties to initialize the group.
   */
  constructor(config: ESPRMGroupInterface) {
    this.name = config.name;
    this.id = config.id;
    this.isPrimaryUser = config.isPrimaryUser;
    this.totalNodes = config.totalNodes;
    this.parentGroupId = config.parentGroupId;
    this.type = config.type;
    this.mutuallyExclusive = config.mutuallyExclusive;
    this.nodes = config.nodes;
    this.nodeDetails = config.nodeDetails?.map((node) => new ESPRMNode(node));
    this.subGroups = config.subGroups?.map((group) => new ESPRMGroup(group));
    this.description = config.description;
    this.metadata = config.metadata;
    this.customData = config.customData;
    this.isMatter = config.isMatter;
    this.fabricId = config.fabricId;
  }
}
