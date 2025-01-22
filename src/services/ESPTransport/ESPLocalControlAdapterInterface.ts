/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

interface ESPLocalControlAdapterInterface {
  /**
   * Checks if the node is connected.
   * @param nodeId - The ID of the node.
   * @returns A promise that resolves to a boolean indicating connection status.
   */
  isConnected(nodeId: string): Promise<boolean>;

  /**
   * Connects to the node with the given parameters.
   * @param nodeId - The ID of the node.
   * @param baseUrl - The baseUrl to reach node locally.
   * @param securtiyType - The type of security to use.
   * @param pop - Proof of possession.
   * @param username - Optional username for authentication.
   * @returns A promise that resolves to a record containing connection details.
   */
  connect(
    nodeId: string,
    baseUrl: string,
    securtiyType: number,
    pop?: string,
    username?: string
  ): Promise<Record<string, any>>;

  /**
   * Sends data to the specified path on the node.
   * @param nodeId - The ID of the node.
   * @param path - The path to send data to.
   * @param data - The data to send.
   * @returns A promise that resolves to a string response from the node.
   */
  sendData(nodeId: string, path: string, data: string): Promise<string>;
}

export { ESPLocalControlAdapterInterface };
