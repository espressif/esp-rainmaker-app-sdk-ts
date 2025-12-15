/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Enum representing the status of a claiming operation.
 */
export enum RMakerClaimStatus {
  Success = 0,
  Fail = 1,
  InvalidParam = 2,
  InvalidState = 3,
  NoMemory = 4,
}

/**
 * Enum representing the message types for claiming operations.
 */
export enum RMakerClaimMsgType {
  TypeCmdClaimStart = 0,
  TypeRespClaimStart = 1,
  TypeCmdClaimInit = 2,
  TypeRespClaimInit = 3,
  TypeCmdClaimVerify = 4,
  TypeRespClaimVerify = 5,
  TypeCmdClaimAbort = 6,
  TypeRespClaimAbort = 7,
}

/**
 * Interface representing a payload buffer for claiming data transfer.
 */
export interface PayloadBuf {
  /** Offset for chunked data transfer */
  offset: number;
  /** The payload data as Uint8Array */
  payload: Uint8Array;
  /** Total length of the data being transferred */
  totalLen: number;
}

/**
 * Interface representing a response payload from the device.
 */
export interface RespPayload {
  /** Status of the operation */
  status: RMakerClaimStatus;
  /** Buffer containing response data */
  buf?: PayloadBuf;
}

/**
 * Interface representing a claiming payload message.
 */
export interface RMakerClaimPayload {
  /** Message type */
  msg: RMakerClaimMsgType;
  /** Command payload (for commands sent to device) */
  cmdPayload?: PayloadBuf;
  /** Response payload (for responses from device) */
  respPayload?: RespPayload;
}

/**
 * Helper class for encoding/decoding claiming protobuf messages.
 * This is a simplified implementation that creates/parses the proto format.
 */
export class ClaimingProtoHelper {
  /**
   * Creates a ClaimStart command payload.
   * Android sends: msg=TypeCmdClaimStart + empty cmdPayload
   * @returns Uint8Array payload
   */
  static createClaimStartRequest(): Uint8Array {
    // Need to include empty cmdPayload to match Android behavior
    const emptyPayloadBuf = this.encodePayloadBuf(0, new Uint8Array(0), 0);
    return this.encodeClaimPayload(
      RMakerClaimMsgType.TypeCmdClaimStart,
      emptyPayloadBuf
    );
  }

  /**
   * Creates a ClaimInit command payload with data from cloud.
   * @param data - The data string to send (from cloud initiate response)
   * @returns Uint8Array payload
   */
  static createClaimInitRequest(data: string): Uint8Array {
    const dataBytes = new TextEncoder().encode(data);
    const totalLen = dataBytes.length;

    // Build the payload
    // Field 1 (msg) = TypeCmdClaimInit (2)
    // Field 10 (cmdPayload) = PayloadBuf
    //   Field 1 (offset) = 0
    //   Field 2 (payload) = dataBytes
    //   Field 3 (totalLen) = totalLen

    const payloadBuf = this.encodePayloadBuf(0, dataBytes, totalLen);
    return this.encodeClaimPayload(
      RMakerClaimMsgType.TypeCmdClaimInit,
      payloadBuf
    );
  }

  /**
   * Creates a ClaimInit request to get more CSR data (continuation request).
   * @returns Uint8Array payload
   */
  static createClaimInitContinueRequest(): Uint8Array {
    // Send with empty cmdPayload to request more data
    const emptyPayloadBuf = this.encodePayloadBuf(0, new Uint8Array(0), 0);
    return this.encodeClaimPayload(
      RMakerClaimMsgType.TypeCmdClaimInit,
      emptyPayloadBuf
    );
  }

  /**
   * Creates a ClaimVerify command payload with certificate data.
   * @param certificateData - The certificate string to send
   * @param offset - Current offset for chunked transfer
   * @param chunkSize - Size of each chunk
   * @returns Uint8Array payload
   */
  static createClaimVerifyRequest(
    certificateData: string,
    offset: number,
    chunkSize: number
  ): Uint8Array {
    const totalLen = certificateData.length;
    const endIndex = Math.min(offset + chunkSize, totalLen);
    const chunk = certificateData.substring(offset, endIndex);
    const dataBytes = new TextEncoder().encode(chunk);

    const payloadBuf = this.encodePayloadBuf(offset, dataBytes, totalLen);
    return this.encodeClaimPayload(
      RMakerClaimMsgType.TypeCmdClaimVerify,
      payloadBuf
    );
  }

  /**
   * Creates a ClaimAbort command payload.
   * @returns Uint8Array payload
   */
  static createClaimAbortRequest(): Uint8Array {
    // Include empty cmdPayload to match Android behavior
    const emptyPayloadBuf = this.encodePayloadBuf(0, new Uint8Array(0), 0);
    return this.encodeClaimPayload(
      RMakerClaimMsgType.TypeCmdClaimAbort,
      emptyPayloadBuf
    );
  }

  /**
   * Parses a claiming response from the device.
   * @param data - The response data as Uint8Array
   * @returns Parsed RMakerClaimPayload
   */
  static parseClaimResponse(data: Uint8Array): RMakerClaimPayload {
    const result: RMakerClaimPayload = {
      msg: RMakerClaimMsgType.TypeRespClaimStart,
    };

    let index = 0;

    while (index < data.length) {
      const tag = data[index++];
      const fieldNumber = tag >> 3;
      const wireType = tag & 0x07;

      switch (fieldNumber) {
        case 1: // msg field
          if (wireType === 0) {
            const { value, newIndex } = this.readVarint(data, index);
            result.msg = value as RMakerClaimMsgType;
            index = newIndex;
          }
          break;

        case 11: // respPayload field (wire type 2 = length-delimited)
          if (wireType === 2) {
            const { value: length, newIndex: lenIndex } = this.readVarint(
              data,
              index
            );
            const respData = data.slice(lenIndex, lenIndex + length);
            result.respPayload = this.parseRespPayload(respData);
            index = lenIndex + length;
          }
          break;

        default:
          // Skip unknown fields
          if (wireType === 0) {
            const { newIndex } = this.readVarint(data, index);
            index = newIndex;
          } else if (wireType === 2) {
            const { value: length, newIndex: lenIndex } = this.readVarint(
              data,
              index
            );
            index = lenIndex + length;
          } else {
            index++;
          }
          break;
      }
    }

    return result;
  }

  /**
   * Extracts the payload string from a response.
   * @param response - The parsed response
   * @returns The payload as a string, or empty string if not available
   */
  static extractPayloadString(response: RMakerClaimPayload): string {
    if (response.respPayload?.buf?.payload) {
      return new TextDecoder().decode(response.respPayload.buf.payload);
    }
    return "";
  }

  /**
   * Gets the offset from a response.
   * @param response - The parsed response
   * @returns The offset value
   */
  static getOffset(response: RMakerClaimPayload): number {
    return response.respPayload?.buf?.offset ?? 0;
  }

  /**
   * Gets the total length from a response.
   * @param response - The parsed response
   * @returns The total length value
   */
  static getTotalLen(response: RMakerClaimPayload): number {
    return response.respPayload?.buf?.totalLen ?? 0;
  }

  /**
   * Checks if the response indicates success.
   * @param response - The parsed response
   * @returns true if status is Success
   */
  static isSuccess(response: RMakerClaimPayload): boolean {
    return response.respPayload?.status === RMakerClaimStatus.Success;
  }

  // Private helper methods

  private static encodeVarint(value: number): Uint8Array {
    const bytes: number[] = [];
    while (value > 127) {
      bytes.push((value & 0x7f) | 0x80);
      value >>>= 7;
    }
    bytes.push(value & 0x7f);
    return new Uint8Array(bytes);
  }

  private static readVarint(
    data: Uint8Array,
    index: number
  ): { value: number; newIndex: number } {
    let value = 0;
    let shift = 0;
    let byte: number;

    do {
      byte = data[index++];
      value |= (byte & 0x7f) << shift;
      shift += 7;
    } while (byte & 0x80);

    return { value, newIndex: index };
  }

  private static encodePayloadBuf(
    offset: number,
    payload: Uint8Array,
    totalLen: number
  ): Uint8Array {
    const parts: Uint8Array[] = [];

    // Field 1: offset (varint)
    parts.push(new Uint8Array([8])); // field 1, wire type 0
    parts.push(this.encodeVarint(offset));

    // Field 2: payload (bytes)
    parts.push(new Uint8Array([18])); // field 2, wire type 2
    parts.push(this.encodeVarint(payload.length));
    parts.push(payload);

    // Field 3: totalLen (varint)
    parts.push(new Uint8Array([24])); // field 3, wire type 0
    parts.push(this.encodeVarint(totalLen));

    // Combine all parts
    const totalLength = parts.reduce((sum, part) => sum + part.length, 0);
    const result = new Uint8Array(totalLength);
    let pos = 0;
    for (const part of parts) {
      result.set(part, pos);
      pos += part.length;
    }
    return result;
  }

  private static encodeClaimPayload(
    msgType: RMakerClaimMsgType,
    cmdPayload?: Uint8Array
  ): Uint8Array {
    const parts: Uint8Array[] = [];

    // Field 1: msg (varint)
    parts.push(new Uint8Array([8])); // field 1, wire type 0
    parts.push(this.encodeVarint(msgType));

    // Field 10: cmdPayload (bytes) - if provided
    if (cmdPayload) {
      parts.push(new Uint8Array([82])); // field 10, wire type 2 (10 << 3 | 2 = 82)
      parts.push(this.encodeVarint(cmdPayload.length));
      parts.push(cmdPayload);
    }

    // Combine all parts
    const totalLength = parts.reduce((sum, part) => sum + part.length, 0);
    const result = new Uint8Array(totalLength);
    let pos = 0;
    for (const part of parts) {
      result.set(part, pos);
      pos += part.length;
    }
    return result;
  }

  private static parseRespPayload(data: Uint8Array): RespPayload {
    // In proto3, absent fields default to 0, which is Success for RMakerClaimStatus
    const result: RespPayload = {
      status: RMakerClaimStatus.Success,
    };

    let index = 0;

    while (index < data.length) {
      const tag = data[index++];
      const fieldNumber = tag >> 3;
      const wireType = tag & 0x07;

      switch (fieldNumber) {
        case 1: // status field
          if (wireType === 0) {
            const { value, newIndex } = this.readVarint(data, index);
            result.status = value as RMakerClaimStatus;
            index = newIndex;
          }
          break;

        case 2: // buf field
          if (wireType === 2) {
            const { value: length, newIndex: lenIndex } = this.readVarint(
              data,
              index
            );
            const bufData = data.slice(lenIndex, lenIndex + length);
            result.buf = this.parsePayloadBuf(bufData);
            index = lenIndex + length;
          }
          break;

        default:
          // Skip unknown fields
          if (wireType === 0) {
            const { newIndex } = this.readVarint(data, index);
            index = newIndex;
          } else if (wireType === 2) {
            const { value: length, newIndex: lenIndex } = this.readVarint(
              data,
              index
            );
            index = lenIndex + length;
          } else {
            index++;
          }
          break;
      }
    }

    return result;
  }

  private static parsePayloadBuf(data: Uint8Array): PayloadBuf {
    const result: PayloadBuf = {
      offset: 0,
      payload: new Uint8Array(0),
      totalLen: 0,
    };

    let index = 0;

    while (index < data.length) {
      const tag = data[index++];
      const fieldNumber = tag >> 3;
      const wireType = tag & 0x07;

      switch (fieldNumber) {
        case 1: // offset
          if (wireType === 0) {
            const { value, newIndex } = this.readVarint(data, index);
            result.offset = value;
            index = newIndex;
          }
          break;

        case 2: // payload
          if (wireType === 2) {
            const { value: length, newIndex: lenIndex } = this.readVarint(
              data,
              index
            );
            result.payload = data.slice(lenIndex, lenIndex + length);
            index = lenIndex + length;
          }
          break;

        case 3: // totalLen
          if (wireType === 0) {
            const { value, newIndex } = this.readVarint(data, index);
            result.totalLen = value;
            index = newIndex;
          }
          break;

        default:
          // Skip unknown fields
          if (wireType === 0) {
            const { newIndex } = this.readVarint(data, index);
            index = newIndex;
          } else if (wireType === 2) {
            const { value: length, newIndex: lenIndex } = this.readVarint(
              data,
              index
            );
            index = lenIndex + length;
          } else {
            index++;
          }
          break;
      }
    }

    return result;
  }
}
