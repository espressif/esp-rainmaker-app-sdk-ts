/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ESPAutomationAction } from "../types/automation";

/**
 * Maps a consumer-facing automation action to the backend payload shape.
 */
export function automationActionToPayload(action: ESPAutomationAction): {
  node_id: string;
  params: Record<string, Record<string, any>>;
} {
  return {
    node_id: action.nodeId,
    params: action.deviceParams,
  };
}
