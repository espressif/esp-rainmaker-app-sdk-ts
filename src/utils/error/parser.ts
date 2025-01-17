/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAPIError } from "../../types/output";

/**
 * Parses an error response from an API and formats it into a standard structure.
 *
 * This function takes an error object and extracts relevant information
 * to return an `ESPAPIResponse` object.
 *
 * @param error - The error object to parse.
 * @returns An object representing the error response with the following properties:
 *  - `status`: A string indicating the status ("failure").
 *  - `statusCode`: The HTTP status code from the error response.
 *  - `errorCode`: A specific error code if available from the response.
 *  - `description`: A description of the error.
 *
 * @throws {Error}
 */
const parseAPIErrorResponse = (error: any, statusCode: number): ESPAPIError => {
  let status: string = "";
  let errorCode: string = "";
  let description: string = "An error has occurred";

  if (error) {
    status = error.status;
    errorCode = error.error_code;
    description = error.description;
  } else {
    throw error;
  }
  return {
    status,
    statusCode,
    errorCode,
    description,
  };
};

export { parseAPIErrorResponse };
