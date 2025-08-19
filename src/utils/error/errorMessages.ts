/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Contains error messages related to configuration issues.
 *
 * These messages are used to provide descriptive errors when
 * configuration validations fail in the ESPRMAuth instance.
 */
const configErrorMessages = {
  /** Error message indicating that the SDK is not configured. */
  SDK_NOT_CONFIGURED: "ESPRMBase is not configured yet",
  /** Error message indicating that the config must be a non-null object. */
  INVALID_CONFIG_OBJECT:
    "Configuration Error: Config must be a non-null object.",
  /** Error message indicating that the base URL is invalid or empty. */
  INVALID_BASE_URL:
    "Configuration Error: BaseUrl must be a non-empty valid URL string.",
  /** Error message indicating that the auth URL is invalid or empty. */
  INVALID_AUTH_URL:
    "Configuration Error: AuthUrl must be a non-empty valid URL string if provided.",
  /** Error message indicating that a redirect URL is required when auth URL is provided. */
  REDIRECT_URL_REQUIRED:
    "Configuration Error: RedirectUrl is required when authUrl is provided.",
  /** Error message indicating that the redirect URL is invalid or empty when auth URL is provided. */
  INVALID_REDIRECT_URL:
    "Configuration Error: RedirectUrl must be a non-empty valid URL string when authUrl is provided.",
  /** Error message indicating that the client ID is required when auth URL is provided. */
  CLIENT_ID_REQUIRED:
    "Configuration Error: ClientId is required and cannot be empty when authUrl is provided.",
  /** Error message indicating that the transport mode is invalid. */
  INVALID_TRANSPORT_MODE:
    "Configuration Error: Invalid transport mode. Please provide a valid transport mode",
};

/**
 * Contains validation error messages for user authentication.
 *
 * These messages are used to inform users about missing or invalid
 * parameters during the authentication process.
 */
const validationErrorMessages = {
  /** Error message indicating that the password is required. */
  MISSING_LOGIN_PASSWORD: "Validation Error: Password is required.",
  /** Error message indicating that the session token is missing. */
  MISSING_LOGIN_REQUEST_SESSION_TOKEN:
    "Validation Error: Session token is required. Please use the requestLoginOTP method to get it.",
  /** Error message indicating that the verification code is missing. */
  MISSING_LOGIN_REQUEST_VERIFICATION_CODE:
    "Validation Error: Verification code is required. Please use the requestLoginOTP method to obtain verification code at mentioned username",
};

/**
 * Contains error messages related to storage adapter issues.
 *
 * These messages inform users about potential issues with storage
 * adapter configurations, especially in unsupported environments.
 */
const storageAdapterErrorMessages = {
  /** Error message indicating that the default storage adapter API is unsupported. */
  UNSUPPORTED_DEFAULT_STORAGE_ADAPTER_API:
    "ESPStorageAdapterError: It seems like your environment doesn't support window.localstorage, you can define your own storage adapter while configuring the ESPRMBase instance. Please refer docs for more information.",
};

/**
 * Contains validation error messages for API calls.
 *
 * These messages are used to inform users when required API parameters
 * are missing or invalid.
 */
const apiCallValidationErrorMessages = {
  /** Error message indicating that the group ID is missing. */
  MISSING_GROUP_ID: "ESPAPICallValidationError: Group ID is required.",
  /** Error message indicating that the group name is missing. */
  MISSING_GROUP_NAME: "ESPAPICallValidationError: Group Name is required.",
  /** Error message indicating that the node list is missing. */
  MISSING_NODE_LIST: "ESPAPICallValidationError: Node list is required.",
  /** Error message indicating that the node ID is missing. */
  MISSING_NODE_ID: "ESPAPICallValidationError: Node ID is required.",
  /** Error message indicating that the secret key is missing. */
  MISSING_SECRET_KEY: "ESPAPICallValidationError: Secret key is required.",
  /** Error message indicating that update information for the group is missing. */
  MISSING_GROUP_UPDATE_INFO:
    "ESPAPICallValidationError: Missing update information for the group.",
  /** Error message indicating that device token or endpoint is missing for delete endpoint operation. */
  MISSING_DELETE_ENDPOINT_PARAMS:
    "ESPAPICallValidationError: Missing deviceToken or endpoint. Please provide any one of them to delete endpoint",
  /** Error message indicating that a device list refresh is required. */
  DEVICE_LIST_REFRESH_REQUIRED:
    "ESPAPICallValidationError: Please refresh the device list.",
  /** Error message indicating that a node is unreachable. */
  NODE_UNREACHABLE:
    "ESPAPICallValidationError: Node is unreachable. Please check the connection.",
  /** Error message indicating that a event type is invalid. */
  INVALID_EVENT_TYPE:
    "ESPAPICallValidationError: Invalid event type. Please provide a valid event type.",
  /** Error message indicating that the base URL is missing. */
  MISSING_BASE_URL: "ESPAPICallValidationError: Base URL is required.",
  /** Error message indicating that the timezone string format is invalid. */
  INVALID_TIMEZONE_FORMAT:
    "ESPAPICallValidationError: Invalid timezone format. Please provide a valid timezone string like 'Asia/Kolkata'",
  /** Error message indicating that the time service is not available. */
  TIME_SERVICE_NOT_AVAILABLE:
    "ESPAPICallValidationError: Time service is not available for the node.",
  /** Error message indicating that the timezone parameter is not available. */
  TIMEZONE_PARAM_NOT_AVAILABLE:
    "ESPAPICallValidationError: Timezone parameter is not available for the node.",
  /** Error message indicating that the OTA job ID is missing. */
  MISSING_OTA_JOB_ID:
    "ESPAPICallValidationError: OTA job ID is required and cannot be empty.",
  /** Error message indicating that the parameter does not support simple time series data. */
  INVALID_SIMPLE_TS_PARAMETER:
    "ESPAPICallValidationError: Parameter does not support simple time series data.",
  /** Error message indicating that the parameter does not support time series data. */
  INVALID_TS_PARAMETER:
    "ESPAPICallValidationError: Parameter does not support time series data.",
  /** Error message indicating invalid data type for time series data. */
  INVALID_TS_DATA_TYPE:
    "ESPAPICallValidationError: Invalid data type. Must be one of: float, int, bool, string.",
  /** Error message indicating that both numIntervals and startTime/endTime are provided. */
  INVALID_TS_PARAMETER_MIXED:
    "ESPAPICallValidationError: Cannot specify both numIntervals and startTime/endTime. Use either numIntervals or startTime/endTime.",
  /** Error message indicating missing timestamp in time series request. */
  MISSING_TS_TIMESTAMP:
    "ESPAPICallValidationError: Both startTime and endTime are required.",
  /** Error message indicating invalid time range in time series request. */
  INVALID_TS_TIME_RANGE:
    "ESPAPICallValidationError: startTime must be less than endTime.",
  /** Error message indicating invalid result count in time series request. */
  INVALID_TS_RESULT_COUNT:
    "ESPAPICallValidationError: resultCount cannot be greater than 200.",
  /** Error message indicating invalid timestamp in time series request. */
  INVALID_TS_TIMESTAMP:
    "ESPAPICallValidationError: Invalid timestamp. Timestamp must be a integer representing unix epoch time in seconds.",
  /** Error message indicating that the node reference is no longer valid. */
  INVALID_NODE_REFERENCE:
    "ESPAPICallValidationError: Node reference is no longer valid. Please refresh the node list.",
  /** Error message for invalid time series interval. */
  INVALID_TS_INTERVAL:
    "ESPAPICallValidationError: numIntervals must be greater than 0",
  /** Error message for invalid time series aggregation interval. */
  INVALID_TS_AGGREGATION_INTERVAL:
    "ESPAPICallValidationError: Invalid aggregation interval. Must be one of: minute, hour, day, week, month, year",
  /** Error message for invalid time series aggregation. */
  INVALID_TS_AGGREGATION:
    "ESPAPICallValidationError: Invalid aggregation method. Must be one of: raw, latest, min, max, count, avg, sum",
  /** Error message for invalid time series week start. */
  INVALID_TS_WEEK_START:
    "ESPAPICallValidationError: Invalid week start. Must be one of: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday",
  /** Error message for invalid time series differential. */
  INVALID_TS_DIFFERENTIAL:
    "ESPAPICallValidationError: Differential is only supported for float and int data types",
  /** Error message for invalid time series reset on negative. */
  INVALID_TS_RESET_ON_NEGATIVE:
    "ESPAPICallValidationError: resetOnNegative can only be used when differential is true",
  /** Error message for invalid time series timezone. */
  INVALID_TS_TIMEZONE:
    "ESPAPICallValidationError: Invalid timezone. Must be a valid IANA timezone name",
  /** Error message for missing aggregation interval in time series request when aggregate is provided. */
  MISSING_TS_AGGREGATION_INTERVAL:
    "ESPAPICallValidationError: Aggregation interval is required when aggregate is provided",
  /** Error message indicating that the automation name is missing. */
  MISSING_AUTOMATION_NAME:
    "ESPAPICallValidationError: Automation name is required.",
  /** Error message indicating that automation events are missing. */
  MISSING_AUTOMATION_EVENTS:
    "ESPAPICallValidationError: At least one event is required for automation.",
  /** Error message indicating that automation actions are missing. */
  MISSING_AUTOMATION_ACTIONS:
    "ESPAPICallValidationError: At least one action is required for automation.",
  /** Error message indicating that the latitude is missing. */
  MISSING_LATITUDE: "ESPAPICallValidationError: Latitude is required.",
  /** Error message indicating that the longitude is missing. */
  MISSING_LONGITUDE: "ESPAPICallValidationError: Longitude is required.",
  /** Error message indicating that geographical coordinates are missing. */
  MISSING_GEO_COORDINATES:
    "ESPAPICallValidationError: Location is required for daylight-based automation. Please either provide location in the automation details or set it using setGeoCoordinates API.",
  /** Error message indicating that geographical coordinates are invalid. */
  INVALID_GEO_COORDINATES:
    "ESPAPICallValidationError: Invalid geographical coordinates format in user's custom data.",
  /** Error message indicating that the automation ID is missing. */
  MISSING_AUTOMATION_ID:
    "ESPAPICallValidationError: Automation ID is required.",
  /** Error message indicating that automation update details are missing. */
  MISSING_AUTOMATION_UPDATE_DETAILS:
    "Automation update details are required. Please provide at least one field to update.",
  /** Error message indicating that the oauth adapter is missing. */
  MISSING_OAUTH_ADAPTER:
    "ESPAPICallValidationError: Oauth adapter is missing. Please set oauth adapter using ESPRMBase.setOauthAdapter method first",
  /** Error message indicating that the identity provider is missing. */
  MISSING_IDENTITY_PROVIDER:
    "ESPAPICallValidationError: Identity provider is required. Please provide a valid identity provider.",
  /** Error message indicating that the auth URL is missing. */
  MISSING_AUTH_URL:
    "ESPAPICallValidationError: Auth URL is required. Please provide a valid auth URL.",
  /** Error message indicating that the redirect URL is missing. */
  MISSING_REDIRECT_URL:
    "ESPAPICallValidationError: Redirect URL is required. Please provide a valid redirect URL.",
  /** Error message indicating that the client ID is missing. */
  MISSING_CLIENT_ID:
    "ESPAPICallValidationError: Client ID is required. Please provide a valid client ID.",
};

/**
 * Contains error messages related to token access issues.
 *
 * These messages are used to inform users when there is a problem with
 * the authentication tokens.
 */
const tokenErrorMessages = {
  /** Error message indicating that the access token is missing. */
  MISSING_ACCESS_TOKEN:
    "ESPTokenError: Access token is missing. User needs to authenticate.",
  /** Error message indicating that the refresh token is missing. */
  MISSING_REFRESH_TOKEN:
    "ESPTokenError: Refresh token is missing. Cannot renew access token.",
  /** Error message indicating that extending the session failed. */
  EXTEND_SESSION_FAILED: "ESPTokenError: Unable to extend session",
};

/**
 * Contains provisioning-related error messages.
 *
 * These messages are used to inform users about issues during the
 * device provisioning process.
 */
const provErrorMessages = {
  /** Error message indicating that the provisioning adapter is missing. */
  MISSING_PROV_ADAPTER:
    "ESPProvError: Provisioning adapter is missing. Please set provision adapter using setProvisioningAdapter method first",
  /** Error message indicating that the node ID is missing. */
  MISSING_NODE_ID: "ESPProvError: Failed to get nodeId.",
  /** Error message indicating that the ID token is missing. */
  MISSING_ID_TOKEN: "ESPProvError: Failed to fetch Id token",
  /** Error message indicating that device provisioning failed. */
  FAILED_PROV: "ESPProvError: Failed device provisioning",
  /** Error message indicating that user device association failed. */
  FAILED_USER_DEVICE_ASSOCIATION:
    "ESPProvError: Failed user device association",
  /** Error message indicating that creating a user node mapping request failed due to network issues. */
  FAILED_USER_NODE_MAPPING_REQUEST_CREATION:
    "ESPProvError: Failed to create user node mapping request due to some network failure",
  /** Error message indicating that the user device mapping cloud operation timed out. */
  FAILED_USER_NODE_MAPPING_CLOUD_TIMEOUT:
    "ESPProvError: Timed out user device mapping on cloud",
};

const defaultErrorMessages = {
  /** Error message indicating that an unknown error occurred. */
  UNKNOWN_ERROR: "An unknown error occurred.",
  /** Error message indicating that an unknown error occurred during configuration. */
  CONFIGURATION_ERROR: "An unknown error occurred while configuring.",
  /** Error message indicating that an unknown error occurred during provision. */
  PROVISION_ERROR: "An unknown error occurred while provisioning.",
};

export {
  configErrorMessages,
  validationErrorMessages,
  storageAdapterErrorMessages,
  apiCallValidationErrorMessages,
  tokenErrorMessages,
  provErrorMessages,
  defaultErrorMessages,
};
