/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../../../src/ESPRMNode";
import { ESPAutomation } from "../../../../src/ESPAutomation";
import { ESPAutomationDetails } from "../../../../src/types/automation";
import { apiCallValidationErrorMessages } from "../../../../src/utils/error/errorMessages";
import { ESPAPICallValidationError } from "../../../../src/utils/error/ESPAPICallValidationError";
import { MOCK_AUTOMATION_DETAILS } from "../utils";

// Success test case

/**
 * Helper function to test adding automation
 * @param node - The node instance
 * @param automationDetails - The automation details to add
 */
export async function addAutomationSuccessTest(
  node: ESPRMNode,
  automationDetails: ESPAutomationDetails
) {
  const automation = await node.addAutomation(automationDetails);
  expect(automation).toBeInstanceOf(ESPAutomation);
}

// Error test cases

/**
 * Helper function to test adding automation with missing name
 * @param node - The node instance
 */
export async function addAutomationMissingNameTest(node: ESPRMNode) {
  const invalidDetails = { ...MOCK_AUTOMATION_DETAILS, name: "" };
  try {
    await node.addAutomation(invalidDetails);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_AUTOMATION_NAME
    );
  }
}

/**
 * Helper function to test adding automation with missing events
 * @param node - The node instance
 */
export async function addAutomationMissingEventsTest(node: ESPRMNode) {
  const invalidDetails = { ...MOCK_AUTOMATION_DETAILS, events: [] };
  try {
    await node.addAutomation(invalidDetails);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_AUTOMATION_EVENTS
    );
  }
}

/**
 * Helper function to test adding automation with missing actions
 * @param node - The node instance
 */
export async function addAutomationMissingActionsTest(node: ESPRMNode) {
  const invalidDetails = { ...MOCK_AUTOMATION_DETAILS, actions: [] };
  try {
    await node.addAutomation(invalidDetails);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_AUTOMATION_ACTIONS
    );
  }
}
