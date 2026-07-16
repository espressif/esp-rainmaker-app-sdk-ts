/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAPIManager } from "../ESPRMAPIManager";
import {
  HTTPMethods,
  ClaimErrorCodes,
  APIEndpoints,
  ClaimCapabilities,
  ClaimNodePolicies,
} from "../../utils/constants";
import { ESPClaimError } from "../../utils/error/ESPClaimError";
import { ESPRMBase } from "../../ESPRMBase";

/**
 * Interface for claiming initiate request body
 */
export interface ClaimInitiateRequest {
  [key: string]: any;
}

/**
 * Interface for claiming verify request body
 */
export interface ClaimVerifyRequest {
  [key: string]: any;
}

/**
 * Helper class for handling Claiming API calls to the cloud.
 */
export class ClaimingHelper {
  /**
   * Gets the claiming base URL from the ESPRMBase configuration.
   * @returns The claiming base URL
   * @throws {ESPClaimError} If claimUrl is not configured.
   */
  private static getclaimUrl(): string {
    const claimUrl = ESPRMBase.getConfig().claimUrl;
    if (!claimUrl) {
      throw new ESPClaimError(ClaimErrorCodes.CLAIM_URL_NOT_CONFIGURED);
    }
    return claimUrl;
  }

  /**
   * Initiates the claiming process by sending device info to the cloud.
   *
   * @param deviceInfo - The device info JSON from the claim start response
   * @returns Promise resolving to the cloud response data
   * @throws Error if the API call fails
   */
  static async initiateClaim(
    deviceInfo: ClaimInitiateRequest
  ): Promise<string> {
    try {
      const baseUrl = this.getclaimUrl();
      const response = await ESPRMAPIManager.authorizeRequest({
        method: HTTPMethods.POST,
        baseURL: baseUrl,
        url: APIEndpoints.CLAIM_INITIATE,
        headers: {
          "Content-Type": "application/json",
        },
        data: deviceInfo,
      });
      // The response should be JSON that needs to be stringified for sending to device
      if (response) {
        return JSON.stringify(response);
      }

      throw new ESPClaimError(ClaimErrorCodes.CLAIM_API_FAILED);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verifies the claiming by sending CSR to the cloud and getting the certificate.
   *
   * @param csrData - The CSR JSON data from the device
   * @param claimCapability - Optional claim capability string. When set to ClaimCapabilities.CAMERA_CLAIM, adds node_policies for video streaming.
   * @returns Promise resolving to the certificate data
   * @throws Error if the API call fails
   */
  static async verifyClaim(csrData: ClaimVerifyRequest, claimCapability?: ClaimCapabilities): Promise<string> {
    try {
      const baseUrl = this.getclaimUrl();

      // If camera_claim capability is specified, add node_policies for video streaming
      const requestData = { ...csrData };
      if (claimCapability === ClaimCapabilities.CAMERA_CLAIM) {
        requestData.node_policies = ClaimNodePolicies.VIDEOSTREAM;
      }

      const response = await ESPRMAPIManager.authorizeRequest({
        method: HTTPMethods.POST,
        baseURL: baseUrl,
        url: APIEndpoints.CLAIM_VERIFY,
        headers: {
          "Content-Type": "application/json",
        },
        data: requestData,
      });

      // The response should contain the certificate
      if (response) {
        // If response is already a string, return it
        if (typeof response === "string") {
          return response;
        }
        // Otherwise stringify it
        return JSON.stringify(response);
      }

      throw new ESPClaimError(ClaimErrorCodes.CLAIM_API_FAILED);
    } catch (error) {
      throw error;
    }
  }
}
