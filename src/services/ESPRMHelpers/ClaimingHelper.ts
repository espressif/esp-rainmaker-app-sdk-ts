/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAPIManager } from "../ESPRMAPIManager";
import {
  HTTPMethods,
  DEFAULT_CLAIM_BASE_URL,
  ClaimErrorCodes,
  APIEndpoints,
} from "../../utils/constants";
import { ESPClaimError } from "../../utils/error/ESPClaimError";

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
   * Gets the claiming base URL.
   * Uses the default claiming URL for ESP RainMaker.
   * @returns The claiming base URL
   */
  private static getClaimBaseUrl(): string {
    return DEFAULT_CLAIM_BASE_URL;
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
      const baseUrl = this.getClaimBaseUrl();
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
   * @returns Promise resolving to the certificate data
   * @throws Error if the API call fails
   */
  static async verifyClaim(csrData: ClaimVerifyRequest): Promise<string> {
    try {
      const baseUrl = this.getClaimBaseUrl();

      const response = await ESPRMAPIManager.authorizeRequest({
        method: HTTPMethods.POST,
        baseURL: baseUrl,
        url: APIEndpoints.CLAIM_VERIFY,
        headers: {
          "Content-Type": "application/json",
        },
        data: csrData,
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
