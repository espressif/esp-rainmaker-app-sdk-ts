/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPDevice } from "../../../src/ESPDevice";
import { ESPProvResponseStatus } from "../../../src/types/provision";
import {
  StatusMessage,
  ProvErrorCodes,
  ESPProvProgressMessages,
} from "../../../src/utils/constants";
import { ESPProvError } from "../../../src/utils/error/Error";
import {
  MOCK_SSID,
  MOCK_PASSPHRASE,
  MOCK_NODE_ID,
  MOCK_GROUP_ID,
  mockProgressCallback,
} from "./utils";

/** Challenge string returned by initiateUserNodeMapping for CHAL_RESP flow */
export const MOCK_CHAL_RESP_CHALLENGE = "test-challenge-data";

/** Request ID returned by initiateUserNodeMapping for CHAL_RESP flow */
export const MOCK_CHAL_RESP_REQUEST_ID = "test-request-id";

/** Valid initiateUserNodeMapping API response for CHAL_RESP flow */
export const MOCK_CHAL_RESP_INITIATE_RESPONSE = {
  challenge: MOCK_CHAL_RESP_CHALLENGE,
  request_id: MOCK_CHAL_RESP_REQUEST_ID,
};

/** Valid device challenge-response (signedChallenge must be hex for parseAndValidateDeviceResponse) */
export const MOCK_CHAL_RESP_DEVICE_RESPONSE = {
  success: true,
  nodeId: MOCK_NODE_ID,
  signedChallenge: "a1b2c3d4e5f67890",
};

/** Valid verifyUserNodeMapping API response */
export const MOCK_CHAL_RESP_VERIFY_SUCCESS = {
  status: StatusMessage.SUCCESS,
  description: "User node mapping verified successfully",
};

/** Placeholder base64 for sendData response in CHAL_RESP (parsed response is mocked via ChallengeResponseHelper) */
export const MOCK_CHAL_RESP_SENDDATA_RESPONSE = "dGVzdC1jaGFsLXJlc3A=";

/**
 * Helper: test successful CHAL_RESP provision (full flow).
 * Expects mocks to be set up for initiateUserNodeMapping, sendData, ChallengeResponseHelper, verifyUserNodeMapping, adapter.provision.
 */
export async function chalRespProvisionSuccessTest(device: ESPDevice) {
  await device.provision(
    MOCK_SSID,
    MOCK_PASSPHRASE,
    mockProgressCallback,
    undefined
  );
  expect(mockProgressCallback).toHaveBeenCalled();
  const lastCall =
    mockProgressCallback.mock.calls[
      mockProgressCallback.mock.calls.length - 1
    ][0];
  expect(lastCall.status).toBe(ESPProvResponseStatus.succeed);
}

/**
 * Helper: test successful CHAL_RESP provision with groupId.
 */
export async function chalRespProvisionSuccessWithGroupIdTest(
  device: ESPDevice
) {
  await device.provision(
    MOCK_SSID,
    MOCK_PASSPHRASE,
    mockProgressCallback,
    MOCK_GROUP_ID
  );
  expect(mockProgressCallback).toHaveBeenCalled();
  const lastCall =
    mockProgressCallback.mock.calls[
      mockProgressCallback.mock.calls.length - 1
    ][0];
  expect(lastCall.status).toBe(ESPProvResponseStatus.succeed);
}

/**
 * Helper: test CHAL_RESP fails with INVALID_MAPPING_RESPONSE when initiate returns invalid response.
 */
export async function chalRespProvisionInvalidMappingResponseTest(
  device: ESPDevice
) {
  try {
    await device.provision(
      MOCK_SSID,
      MOCK_PASSPHRASE,
      mockProgressCallback,
      undefined
    );
    fail("Expected provision to throw INVALID_MAPPING_RESPONSE");
  } catch (error) {
    expect(error).toBeInstanceOf(ESPProvError);
    expect((error as ESPProvError).code).toBe(
      ProvErrorCodes.INVALID_MAPPING_RESPONSE
    );
  }
}

/**
 * Helper: test CHAL_RESP fails with INVALID_CHALLENGE_RESPONSE_FORMAT when device response is invalid.
 */
export async function chalRespProvisionInvalidChallengeResponseTest(
  device: ESPDevice
) {
  try {
    await device.provision(
      MOCK_SSID,
      MOCK_PASSPHRASE,
      mockProgressCallback,
      undefined
    );
    fail("Expected provision to throw INVALID_CHALLENGE_RESPONSE_FORMAT");
  } catch (error) {
    expect(error).toBeInstanceOf(ESPProvError);
    expect((error as ESPProvError).code).toBe(
      ProvErrorCodes.INVALID_CHALLENGE_RESPONSE_FORMAT
    );
  }
}

/**
 * Helper: test CHAL_RESP fails with VERIFY_NODE_MAPPING_FAILED when verify returns non-success.
 */
export async function chalRespProvisionVerifyFailureTest(device: ESPDevice) {
  try {
    await device.provision(
      MOCK_SSID,
      MOCK_PASSPHRASE,
      mockProgressCallback,
      undefined
    );
    fail("Expected provision to throw VERIFY_NODE_MAPPING_FAILED");
  } catch (error) {
    expect(error).toBeInstanceOf(ESPProvError);
    expect((error as ESPProvError).code).toBe(
      ProvErrorCodes.VERIFY_NODE_MAPPING_FAILED
    );
  }
}

/**
 * Helper: test CHAL_RESP fails with SET_NETWORK_CREDENTIALS_FAILED when adapter.provision fails.
 */
export async function chalRespProvisionSetCredentialsFailureTest(
  device: ESPDevice
) {
  try {
    await device.provision(
      MOCK_SSID,
      MOCK_PASSPHRASE,
      mockProgressCallback,
      undefined
    );
    fail("Expected provision to throw SET_NETWORK_CREDENTIALS_FAILED");
  } catch (error) {
    expect(error).toBeInstanceOf(ESPProvError);
    expect((error as ESPProvError).code).toBe(
      ProvErrorCodes.SET_NETWORK_CREDENTIALS_FAILED
    );
  }
}

/**
 * Helper: verify progress messages for CHAL_RESP success flow (initiating, sending challenge, verifying, setting credentials, succeed).
 */
export function verifyChalRespProgressMessages(
  mockProgressCallback: jest.Mock,
  expectedMessages: string[]
) {
  const calls = mockProgressCallback.mock.calls.map((c) => c[0].description);
  expectedMessages.forEach((msg) => {
    expect(calls).toContain(msg);
  });
}

/** Expected progress descriptions in order for a successful CHAL_RESP flow */
export const CHAL_RESP_SUCCESS_PROGRESS_MESSAGES = [
  ESPProvProgressMessages.INITIATING_NODE_ASSOCIATION,
  ESPProvProgressMessages.SENDING_CHALLENGE_TO_DEVICE,
  ESPProvProgressMessages.VERIFYING_NODE_ASSOCIATION,
  ESPProvProgressMessages.SETTING_NETWORK_CREDENTIALS,
];
