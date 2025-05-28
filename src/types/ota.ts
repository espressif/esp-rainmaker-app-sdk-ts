/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Represents OTA update information
 */
interface ESPOTAUpdateResponse {
  status: string;
  otaAvailable: boolean;
  description: string;
  fwVersion: string;
  otaJobId: string;
  fileSize: number;
  url?: string;
  fileMD5?: string;
  streamId?: string;
  metadata?: Record<string, any>;
}

/**
 * Represents the backend response format for OTA update check
 */
interface ESPRawOTAUpdateResponse {
  status: string;
  ota_available: boolean;
  description: string;
  fw_version: string;
  ota_job_id: string;
  file_size: number;
  url?: string;
  file_md5?: string;
  stream_id?: string;
  metadata?: Record<string, any>;
}

/**
 * Represents OTA update status response
 */
interface ESPOTAUpdateStatusResponse {
  nodeId: string;
  status: string;
  additionalInfo: string;
  timestamp: number;
}

/**
 * Represents the backend response format for OTA update status
 */
interface ESPRawOTAUpdateStatusResponse {
  node_id: string;
  status: string;
  additional_info: string;
  timestamp: number;
}

export {
  ESPOTAUpdateResponse,
  ESPRawOTAUpdateResponse,
  ESPOTAUpdateStatusResponse,
  ESPRawOTAUpdateStatusResponse,
};
