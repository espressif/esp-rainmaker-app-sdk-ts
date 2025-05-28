/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../../../src/index";
import { ESPAPICallValidationError } from "../../../../src/utils/error/Error";
import { apiCallValidationErrorMessages } from "../../../../src/utils/error/errorMessages";
import { OTA_TEST_VALUES } from "../utils";

// Success test case

/**
 * Helper function to test successful OTA update status check
 * @param node - The ESPRMNode instance to test with
 * @param jobId - The valid OTA job ID
 */
export const getOTAUpdateStatusSuccessTest = async (
  node: ESPRMNode,
  jobId: string
) => {
  const otaStatusResponse = await node.getOTAUpdateStatus(jobId);

  expect(otaStatusResponse).toBeDefined();
  expect(otaStatusResponse.nodeId).toBe(node.id);
  expect(otaStatusResponse.status).toBeDefined();
};

// Error test cases

/**
 * Helper function to test OTA update status check with empty job ID
 * @param node - The ESPRMNode instance to test with
 */
export const getOTAUpdateStatusEmptyJobIdTest = async (node: ESPRMNode) => {
  try {
    await node.getOTAUpdateStatus(OTA_TEST_VALUES.MOCK_EMPTY_JOB_ID);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_OTA_JOB_ID
    );
  }
};

/**
 * Helper function to test OTA update status check with undefined job ID
 * @param node - The ESPRMNode instance to test with
 */
export const getOTAUpdateStatusUndefinedJobIdTest = async (node: ESPRMNode) => {
  try {
    await node.getOTAUpdateStatus(
      OTA_TEST_VALUES.MOCK_UNDEFINED_JOB_ID as unknown as string
    );
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_OTA_JOB_ID
    );
  }
};
