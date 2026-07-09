/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import "../../src/methods/ESPRMUser";
import { ESPRMUser } from "../../src/ESPRMUser";
import { ESPRMStorage } from "../../src/services/ESPRMStorage/ESPRMStorage";
import { MOCK_USER_TOKENS } from "../helpers/provision/utils";

jest.mock("../../src/services/ESPRMStorage/ESPRMStorage");

const TEST_EVENT = "com.espressif.event.matterControllerFound";

describe("[Unit Test]: ESPRMUser - EventSubscriptionModel", () => {
  let userA: ESPRMUser;
  let userB: ESPRMUser;

  beforeEach(() => {
    ESPRMUser.eventCallbacks = {};
    userA = new ESPRMUser(MOCK_USER_TOKENS);
    userB = new ESPRMUser(MOCK_USER_TOKENS);
  });

  afterEach(() => {
    ESPRMUser.eventCallbacks = {};
    jest.clearAllMocks();
  });

  test("should deliver events across different ESPRMUser instances", () => {
    const callback = jest.fn();
    userA.subscribe(TEST_EVENT, callback);

    const payload = { nodeId: "node-123" };
    userB.trigger(TEST_EVENT, payload);

    expect(callback).toHaveBeenCalledWith(payload);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("should stop delivering events after unsubscribe", () => {
    const callback = jest.fn();
    userA.subscribe(TEST_EVENT, callback);
    userA.unsubscribe(TEST_EVENT, callback);

    userB.trigger(TEST_EVENT, { nodeId: "node-123" });

    expect(callback).not.toHaveBeenCalled();
  });

  test("should clear all callbacks when cleanUpResources is called", async () => {
    const callback = jest.fn();
    userA.subscribe(TEST_EVENT, callback);

    (ESPRMStorage.getItem as jest.Mock).mockResolvedValue(null);

    await userA.cleanUpResources();

    userB.trigger(TEST_EVENT, { nodeId: "node-123" });

    expect(callback).not.toHaveBeenCalled();
  });
});
