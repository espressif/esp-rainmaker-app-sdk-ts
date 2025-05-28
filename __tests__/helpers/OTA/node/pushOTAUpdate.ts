/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../../../src/index";
import { StatusMessage } from "../../../../src/utils/constants";
import { ESPAPICallValidationError } from "../../../../src/utils/error/Error";
import { apiCallValidationErrorMessages } from "../../../../src/utils/error/errorMessages";
import { OTA_TEST_VALUES } from "../utils";

// Success test case

/**
 * Helper function to test successful OTA update push
 * @param node - The ESPRMNode instance to test with
 * @param jobId - The valid OTA job ID
 */
export const pushOTAUpdateSuccessTest = async (
  node: ESPRMNode,
  jobId: string
) => {
  const pushOTAResponse = await node.pushOTAUpdate(jobId);
  expect(pushOTAResponse).toBeDefined();
  expect(pushOTAResponse.status).toBe(StatusMessage.SUCCESS);
};

// Error test cases

/**
 * Helper function to test push OTA update with empty job ID
 * @param node - The ESPRMNode instance to test with
 */
export const pushOTAUpdateEmptyJobIdTest = async (node: ESPRMNode) => {
  try {
    await node.pushOTAUpdate(OTA_TEST_VALUES.MOCK_EMPTY_JOB_ID);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_OTA_JOB_ID
    );
  }
};

/**
 * Helper function to test push OTA update with undefined job ID
 * @param node - The ESPRMNode instance to test with
 */
export const pushOTAUpdateUndefinedJobIdTest = async (node: ESPRMNode) => {
  try {
    await node.pushOTAUpdate(
      OTA_TEST_VALUES.MOCK_UNDEFINED_JOB_ID as unknown as string
    );
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_OTA_JOB_ID
    );
  }
};
