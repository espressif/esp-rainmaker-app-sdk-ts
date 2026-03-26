/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { rmaker_misc } from "../../proto/esp_rmaker_chal_resp";
import {
  ChallengeResponseValidationErrors,
  RMakerCapabilities,
} from "../../utils/constants";

/**
 * Response from parsing device challenge-response.
 */
export interface DeviceChallengeResponse {
  success: boolean;
  nodeId?: string;
  signedChallenge?: string;
  error?: string;
}

/**
 * Challenge-response helper for ESP RainMaker provisioning flow.
 * Handles protobuf creation, device communication, and response parsing.
 */
export class ChallengeResponseHelper {
  /**
   * Creates a challenge request payload using the esp_rmaker_chal_resp proto.
   */
  static createChallengeRequest(challenge: string): Uint8Array {
    const challengeBytes = new TextEncoder().encode(challenge);

    const cmdPayload = new rmaker_misc.CmdCRPayload({
      payload: challengeBytes,
    });

    const miscPayload = new rmaker_misc.RMakerMiscPayload({
      msg: rmaker_misc.RMakerMiscMsgType.TypeCmdChallengeResponse,
      status: rmaker_misc.RMakerMiscStatus.Success,
      cmdChallengeResponsePayload: cmdPayload,
    });

    return miscPayload.serialize();
  }

  /**
   * Validates deserialized `RMakerMiscPayload` (status and challenge-response fields).
   * @returns Error result if invalid; `null` if valid and parsing may continue.
   */
  private static validateResponse(
    response: rmaker_misc.RMakerMiscPayload
  ): DeviceChallengeResponse | null {
    if (response.status !== rmaker_misc.RMakerMiscStatus.Success) {
      return {
        success: false,
        error: ChallengeResponseValidationErrors.DEVICE_UNSUCCESSFUL_STATUS,
      };
    }
    const resp = response.respChallengeResponsePayload;
    if (!resp) {
      return {
        success: false,
        error:
          ChallengeResponseValidationErrors.MISSING_CHALLENGE_RESPONSE_PAYLOAD,
      };
    }
    if (!resp.payload || !resp.node_id) {
      return {
        success: false,
        error: ChallengeResponseValidationErrors.INVALID_RESPONSE_PAYLOAD,
      };
    }
    return null;
  }

  /**
   * Parses the device response from challenge-response protocol and validates format
   * (success, nodeId, signedChallenge present, signedChallenge is valid hex).
   */
  static parseAndValidateDeviceResponse(
    responseData: Uint8Array
  ): DeviceChallengeResponse {
    try {
      const response = rmaker_misc.RMakerMiscPayload.deserialize(responseData);
      const validationError =
        ChallengeResponseHelper.validateResponse(response);
      if (validationError) {
        return validationError;
      }

      const resp =
        response.respChallengeResponsePayload as rmaker_misc.RespCRPayload;
      const { node_id: nodeId, payload } = resp;
      const signedChallenge = Array.from(payload)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const parsedResponse: DeviceChallengeResponse = {
        success: true,
        nodeId,
        signedChallenge,
      };

      if (!ChallengeResponseHelper.validateChallengeResponse(parsedResponse)) {
        return {
          success: false,
          error:
            ChallengeResponseValidationErrors.INVALID_CHALLENGE_RESPONSE_FORMAT,
        };
      }

      return parsedResponse;
    } catch (error: unknown) {
      const errorMessage =
        (error as Error)?.message ??
        ChallengeResponseValidationErrors.FAILED_TO_PARSE_DEVICE_RESPONSE;
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Validates challenge response format (success, nodeId, signedChallenge as hex).
   */
  static validateChallengeResponse(response: DeviceChallengeResponse): boolean {
    if (!response.success || !response.nodeId || !response.signedChallenge) {
      return false;
    }
    const hexRegex = /^[0-9a-fA-F]+$/;
    return hexRegex.test(response.signedChallenge);
  }

  /**
   * Checks if the ESP device supports challenge-response authentication flow.
   * Challenge-response is indicated by "ch_resp" in the device's rmaker_extra.cap array
   *
   * @param versionInfo - The version info object from the ESP device
   * @returns true if challenge-response is supported, false otherwise
   */
  static checkChallengeResponseCapability(versionInfo: {
    [key: string]: any;
  }): boolean {
    try {
      const rmakerExtra = versionInfo?.rmaker_extra;
      if (!rmakerExtra || typeof rmakerExtra !== "object") {
        return false;
      }

      const extraCapabilities = rmakerExtra.cap;
      if (!Array.isArray(extraCapabilities)) {
        return false;
      }

      return extraCapabilities.includes(RMakerCapabilities.CHALLENGE_RESPONSE);
    } catch {
      return false;
    }
  }
}
