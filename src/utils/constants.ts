/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * An object containing the HTTP methods commonly used in API requests.
 *
 * @enum {string}
 */
const HTTPMethods = {
  /** Represents the GET HTTP method. */
  GET: "GET",
  /** Represents the PUT HTTP method. */
  PUT: "PUT",
  /** Represents the POST HTTP method. */
  POST: "POST",
  /** Represents the DELETE HTTP method. */
  DELETE: "DELETE",
} as const;

/**
 * An object containing the API endpoint paths used in the application.
 *
 * @enum {string}
 */
const APIEndpoints = {
  /** The endpoint for user operations. */
  USER: "user2",
  /** The endpoint for password recovery. */
  FORGOTPASSWORD: "forgotpassword2",
  /** The endpoint for user login. */
  LOGIN: "login2",
  /** The endpoint for password operations. */
  PASSWORD: "password2",
  /** The endpoint for user logout. */
  LOGOUT: "logout2",
  /** The endpoint for token operations. */
  TOKEN: "token",
  /** The endpoint for authorization. */
  AUTHORIZE: "authorize",
  /** The endpoint for user node groups. */
  USER_GROUP: "user/node_group",
  /** The endpoint for user nodes mapping. */
  USER_NODE_MAP: "user/nodes/mapping",
  /** The endpoint for user nodes. */
  USER_NODE: "user/nodes",
  /** The endpoint for user nodes params. */
  USER_NODE_PARAM: "user/nodes/params",
  /** The endpoint for user node status. */
  USER_NODE_STATUS: "user/nodes/status",
  /** The endpoint for user node config. */
  USER_NODE_CONFIG: "user/nodes/config",
  /** The endpoint for user node sharing. */
  USER_NODE_SHARING: "user/nodes/sharing",
  /** The endpoint for user node sharing requests/invitations. */
  USER_NODE_SHARING_REQUESTS: "user/nodes/sharing/requests",
  /** The endpoint for user node group sharing info. */
  USER_GROUP_SHARING: "user/node_group/sharing",
  /** The endpoint for user node group sharing requests/invitations. */
  USER_GROUP_SHARING_REQUESTS: "user/node_group/sharing/requests",
  /** The endpoint for user push notifications mobile platform endpoint. */
  USER_PUSH_NOTIFICATION_MOBILE_PLATFORM_ENDPOINT:
    "user/push_notification/mobile_platform_endpoint",
  /** The endpoint for user custom data. */
  USER_CUSTOM_DATA: "user/custom_data",
  /** The endpoint for user nodes OTA update. */
  USER_NODES_OTA_UPDATE: "user/nodes/ota_update",
  /** The endpoint for user nodes OTA status. */
  USER_NODES_OTA_STATUS: "user/nodes/ota_status",
  /** The endpoint for user node time series simple data. */
  USER_NODE_SIMPLE_TS_DATA: "user/nodes/simple_tsdata",
  /** The endpoint for user node time series data. */
  USER_NODE_TS_DATA: "user/nodes/tsdata",
  /** The endpoint for user node automation. */
  USER_NODE_AUTOMATION: "user/node_automation",
  /** The endpoint for user node mapping initiation. */
  USER_NODE_MAPPING_INITIATE: "user/nodes/mapping/initiate",
  /** The endpoint for user node mapping verification. */
  USER_NODE_MAPPING_VERIFY: "user/nodes/mapping/verify",
  /** The endpoint for retriving mqtt host. */
  MQTT_HOST: "mqtt_host",
} as const;

/**
 * An object containing keys used for accessing stored fields in client storage.
 */
const StorageKeys = {
  /** Key for storing the access token. */
  ACCESSTOKEN: "com.esprmbase.accessToken",
  /** Key for storing the ID token. */
  IDTOKEN: "com.esprmbase.idToken",
  /** Key for storing the refresh token. */
  REFRESHTOKEN: "com.esprmbase.refreshToken",
  /** Key for storing the user id and device token map. */
  USER_DEVICETOKEN_MAP: "com.esprmbase.userDeviceTokenMap",
};

/**
 * An object containing error codes related to configuration issues.
 *
 * @enum {string}
 */
const ConfigErrorCodes = {
  /** Error code indicating the SDK is not configured. */
  SDK_NOT_CONFIGURED: "SDK_NOT_CONFIGURED",
  /** Error code indicating the provided configuration object is invalid. */
  INVALID_CONFIG_OBJECT: "INVALID_CONFIG_OBJECT",
  /** Error code indicating the base URL is invalid. */
  INVALID_BASE_URL: "INVALID_BASE_URL",
  /** Error code indicating the auth URL is invalid. */
  INVALID_AUTH_URL: "INVALID_AUTH_URL",
  /** Error code indicating a redirect URL is required when auth URL is provided. */
  REDIRECT_URL_REQUIRED: "REDIRECT_URL_REQUIRED",
  /** Error code indicating the provided redirect URL is invalid. */
  INVALID_REDIRECT_URL: "INVALID_REDIRECT_URL",
  /** Error code indicating the client ID is required and cannot be empty. */
  CLIENT_ID_REQUIRED: "CLIENT_ID_REQUIRED",
  /** Error code indicating an invalid transport mode. */
  INVALID_TRANSPORT_MODE: "INVALID_TRANSPORT_MODE",
} as const;

/**
 * An object containing error codes related to validation issues.
 *
 * @enum {string}
 */
const ValidationErrorCodes = {
  /** Error code indicating the login password is missing. */
  MISSING_LOGIN_PASSWORD: "MISSING_LOGIN_PASSWORD",
  /** Error code indicating the session token is missing from the login request. */
  MISSING_LOGIN_REQUEST_SESSION_TOKEN: "MISSING_LOGIN_REQUEST_SESSION_TOKEN",
  /** Error code indicating the verification code is missing from the login request. */
  MISSING_LOGIN_REQUEST_VERIFICATION_CODE:
    "MISSING_LOGIN_REQUEST_VERIFICATION_CODE",
} as const;

/**
 * An object containing error codes related to storage adapter issues.
 *
 * @enum {string}
 */
const StorageAdapterErrorCodes = {
  /** Error code indicating the default storage adapter API is unsupported. */
  UNSUPPORTED_DEFAULT_STORAGE_ADAPTER_API:
    "UNSUPPORTED_DEFAULT_STORAGE_ADAPTER_API",
} as const;

/**
 * An object containing error codes related to API call validation issues.
 *
 * @enum {string}
 */
const APICallValidationErrorCodes = {
  /** Error code indicating the group ID is missing. */
  MISSING_GROUP_ID: "MISSING_GROUP_ID",
  /** Error code indicating the group name is missing. */
  MISSING_GROUP_NAME: "MISSING_GROUP_NAME",
  /** Error code indicating the node list is missing. */
  MISSING_NODE_LIST: "MISSING_NODE_LIST",
  /** Error code indicating the node ID is missing. */
  MISSING_NODE_ID: "MISSING_NODE_ID",
  /** Error code indicating the secret key is missing. */
  MISSING_SECRET_KEY: "MISSING_SECRET_KEY",
  /** Error code indicating the group update info is missing. */
  MISSING_GROUP_UPDATE_INFO: "MISSING_GROUP_UPDATE_INFO",
  /** Error code indicating the delete endpoint parameters are missing. */
  MISSING_DELETE_ENDPOINT_PARAMS: "MISSING_DELETE_ENDPOINT_PARAMS",
  /** Error code indicating the device list refresh is required. */
  DEVICE_LIST_REFRESH_REQUIRED: "DEVICE_LIST_REFRESH_REQUIRED",
  /** Error code indicating the node is unreachable. */
  NODE_UNREACHABLE: "NODE_UNREACHABLE",
  /** Error code indicating invalid event type. */
  INVALID_EVENT_TYPE: "INVALID_EVENT_TYPE",
  /** Error code indicating the base URL is missing. */
  MISSING_BASE_URL: "MISSING_BASE_URL",
  /** Error code indicating the timezone string format is invalid. */
  INVALID_TIMEZONE_FORMAT: "INVALID_TIMEZONE_FORMAT",
  /** Error code indicating the time service is not available. */
  TIME_SERVICE_NOT_AVAILABLE: "TIME_SERVICE_NOT_AVAILABLE",
  /** Error code indicating the timezone parameter is not available. */
  TIMEZONE_PARAM_NOT_AVAILABLE: "TIMEZONE_PARAM_NOT_AVAILABLE",
  /** Error code indicating the OTA job ID is missing. */
  MISSING_OTA_JOB_ID: "MISSING_OTA_JOB_ID",
  /** Error code indicating the parameter does not support time series data. */
  INVALID_TS_PARAMETER: "INVALID_TS_PARAMETER",
  /** Error code indicating the parameter does not support simple time series data. */
  INVALID_SIMPLE_TS_PARAMETER: "INVALID_SIMPLE_TS_PARAMETER",
  /** Error code indicating invalid data type for time series data. */
  INVALID_TS_DATA_TYPE: "INVALID_TS_DATA_TYPE",
  /** Error code indicating both numIntervals and startTime/endTime are provided. */
  INVALID_TS_PARAMETER_MIXED: "INVALID_TS_PARAMETER_MIXED",
  /** Error code indicating missing timestamp in time series request. */
  MISSING_TS_TIMESTAMP: "MISSING_TS_TIMESTAMP",
  /** Error code indicating invalid time range in time series request. */
  INVALID_TS_TIME_RANGE: "INVALID_TS_TIME_RANGE",
  /** Error code indicating invalid result count in time series request. */
  INVALID_TS_RESULT_COUNT: "INVALID_TS_RESULT_COUNT",
  /** Error code indicating invalid timestamp in time series request. */
  INVALID_TS_TIMESTAMP: "INVALID_TS_TIMESTAMP",
  /** Error code indicating the node reference is no longer valid. */
  INVALID_NODE_REFERENCE: "INVALID_NODE_REFERENCE",
  /** Error code indicating invalid time interval in time series request. */
  INVALID_TS_INTERVAL: "INVALID_TS_INTERVAL",
  /** Error code indicating invalid aggregation interval in time series request. */
  INVALID_TS_AGGREGATION_INTERVAL: "INVALID_TS_AGGREGATION_INTERVAL",
  /** Error code indicating invalid aggregation method in time series request. */
  INVALID_TS_AGGREGATION: "INVALID_TS_AGGREGATION",
  /** Error code indicating invalid week start in time series request. */
  INVALID_TS_WEEK_START: "INVALID_TS_WEEK_START",
  /** Error code indicating invalid differential configuration in time series request. */
  INVALID_TS_DIFFERENTIAL: "INVALID_TS_DIFFERENTIAL",
  /** Error code indicating invalid reset on negative configuration in time series request. */
  INVALID_TS_RESET_ON_NEGATIVE: "INVALID_TS_RESET_ON_NEGATIVE",
  /** Error code indicating invalid timezone in time series request. */
  INVALID_TS_TIMEZONE: "INVALID_TS_TIMEZONE",
  /** Error code indicating missing aggregation interval in time series request when aggregate is provided. */
  MISSING_TS_AGGREGATION_INTERVAL: "MISSING_TS_AGGREGATION_INTERVAL",
  /** Error code indicating the automation name is missing. */
  MISSING_AUTOMATION_NAME: "MISSING_AUTOMATION_NAME",
  /** Error code indicating the automation events are missing. */
  MISSING_AUTOMATION_EVENTS: "MISSING_AUTOMATION_EVENTS",
  /** Error code indicating the automation actions are missing. */
  MISSING_AUTOMATION_ACTIONS: "MISSING_AUTOMATION_ACTIONS",
  /** Error code indicating the latitude is missing. */
  MISSING_LATITUDE: "MISSING_LATITUDE",
  /** Error code indicating the longitude is missing. */
  MISSING_LONGITUDE: "MISSING_LONGITUDE",
  /** Error code indicating the geo coordinates are missing. */
  MISSING_GEO_COORDINATES: "MISSING_GEO_COORDINATES",
  /** Error code indicating the geo coordinates are invalid. */
  INVALID_GEO_COORDINATES: "INVALID_GEO_COORDINATES",
  /** Error code indicating the automation ID is missing. */
  MISSING_AUTOMATION_ID: "MISSING_AUTOMATION_ID",
  /** Error code indicating the automation update details are missing. */
  MISSING_AUTOMATION_UPDATE_DETAILS: "MISSING_AUTOMATION_UPDATE_DETAILS",
  /** Error code indicating the oauth adapter is missing. */
  MISSING_OAUTH_ADAPTER: "MISSING_OAUTH_ADAPTER",
  /** Error code indicating the identity provider is missing. */
  MISSING_IDENTITY_PROVIDER: "MISSING_IDENTITY_PROVIDER",
  /** Error code indicating the auth URL is missing. */
  MISSING_AUTH_URL: "MISSING_AUTH_URL",
  /** Error code indicating the redirect URL is missing. */
  MISSING_REDIRECT_URL: "MISSING_REDIRECT_URL",
  /** Error code indicating the client ID is missing. */
  MISSING_CLIENT_ID: "MISSING_CLIENT_ID",
  /** Error code indicating invalid parameter value. */
  INVALID_PARAMETER_VALUE: "INVALID_PARAMETER_VALUE",
} as const;

/**
 * An object containing API operations.
 *
 * @enum {string}
 */
const APIOperations = {
  /** Represents the add operation. */
  ADD: "add",
  /** Represents the remove operation. */
  REMOVE: "remove",
} as const;

/**
 * An object containing error codes related to token access issues.
 *
 * @enum {string}
 */
const TokenErrorCodes = {
  /** Error code indicating the access token is missing. */
  MISSING_ACCESS_TOKEN: "MISSING_ACCESS_TOKEN",
  /** Error code indicating the refresh token is missing. */
  MISSING_REFRESH_TOKEN: "MISSING_REFRESH_TOKEN",
  /** Error code indicating the session extension failed. */
  EXTEND_SESSION_FAILED: "EXTEND_SESSION_FAILED",
} as const;

/**
 * An object containing endpoint paths.
 */
const Endpoint = {
  /** The endpoint for local control. */
  LOCAL_CTRL: "esp_local_ctrl/control",
  /** The endpoint for cloud user association. */
  CLOUD_USER_ASSOCIATION: "cloud_user_assoc",
} as const;

/**
 * An object containing error codes related to provisioning issues.
 *
 * @enum {string}
 */
const ProvErrorCodes = {
  /** Error code indicating the provisioning adapter is missing. */
  MISSING_PROV_ADAPTER: "MISSING_PROV_ADAPTER",
  /** Error code indicating the node ID is missing. */
  MISSING_NODE_ID: "MISSING_NODE_ID",
  /** Error code indicating the ID token is missing. */
  MISSING_ID_TOKEN: "MISSING_ID_TOKEN",
  /** Error code indicating the provisioning failed. */
  FAILED_PROV: "FAILED_PROV",
  /** Error code indicating the user device association failed. */
  FAILED_USER_DEVICE_ASSOCIATION: "FAILED_USER_DEVICE_ASSOCIATION",
  /** Error code indicating the user node mapping request creation failed. */
  FAILED_USER_NODE_MAPPING_REQUEST_CREATION:
    "FAILED_USER_NODE_MAPPING_REQUEST_CREATION",
  /** Error code indicating the user node mapping cloud timeout. */
  FAILED_USER_NODE_MAPPING_CLOUD_TIMEOUT:
    "FAILED_USER_NODE_MAPPING_CLOUD_TIMEOUT",
} as const;

/**
 * An object containing error codes related to permission issues.
 *
 * @enum {string}
 */
const AppPermissionErrorCodes = {
  /** Error code indicating the BLE permission is not granted. */
  BLE_PERMISSION_NOT_GRANTED: "BLE_PERMISSION_NOT_GRANTED",
  /** Error code indicating the location permission is not granted. */
  LOCATION_PERMISSION_NOT_GRANTED: "LOCATION_PERMISSION_NOT_GRANTED",
} as const;

/**
 * An object containing service types.
 *
 * @enum {string}
 */
const ServiceType = {
  /** Represents the ESP local control TCP service type. */
  ESP_LOCAL_CTRL_TCP: "_esp_local_ctrl._tcp.",
} as const;

/**
 * An object containing protocol types.
 *
 * @enum {string}
 */
const ProtocolType = {
  /** Represents the DNS-SD protocol type. */
  PROTOCOL_DNS_SD: "PROTOCOL_DNS_SD",
} as const;

/**
 * An object containing status messages.
 *
 * @enum {string}
 */
const StatusMessage = {
  /** Represents a success status. */
  SUCCESS: "success",
  /** Represents a confirmed status. */
  CONFIRMED: "confirmed",
  /** Represents a timed out status. */
  TIMEDOUT: "timedout",
} as const;

/** The default REST API version. */
const DEFAULT_REST_API_VERSION = "v1";

/**
 * An object containing ESP service types.
 *
 * @enum {string}
 */
const ESPServiceType = {
  /** Represents the local control service type. */
  LOCAL_CONTROL: "esp.service.local_control",
  /** Represents the time service type. */
  TIME: "esp.service.time",
} as const;

/**
 * An object containing ESP service parameter types.
 */
const ESPServiceParamType = {
  /** Represents the local control parameter type. */
  LOCAL_CONTROL: {
    /** Represents the type parameter. */
    TYPE: "esp.param.local_control_type",
    /** Represents the POP parameter. */
    POP: "esp.param.local_control_pop",
  },
  /** Represents the time service parameter type. */
  TIME: {
    /** Represents the timezone parameter. */
    TIMEZONE: "esp.param.tz",
  },
} as const;

/**
 * An object containing ESP provisioning progress messages.
 */
const ESPProvProgressMessages = {
  /** Message indicating the start of user device association. */
  START_ASSOCIATION: "Starting user device association...",
  /** Message indicating the association config request creation. */
  ASSOCIATION_CONFIG_CREATED: "Association config request created.",
  /** Message indicating the sending of association config request. */
  SENDING_ASSOCIATION_CONFIG:
    "Sending association config request to 'cloud_user_assoc' endPoint.",
  /** Message indicating the successful sending of association config request. */
  ASSOCIATION_CONFIG_SENT:
    "Association config request sent successfully to 'cloud_user_assoc' endPoint.",
  /** Message indicating the successful device provisioning. */
  DEVICE_PROVISIONED: "Succeed device provisioning",
  /** Message indicating the successful user node mapping. */
  USER_NODE_MAPPING_SUCCEED: "User node mapping succeed",
  /** Message indicating the decoding of response data. */
  DECODING_RESPONSE_DATA: "Decoding response data",
  /** Message indicating the successful decoding of NodeId from response data. */
  DECODED_NODE_ID: "Decoded NodeId from response data successfully",
  /** Message indicating the node timeZone setup process initiation. */
  INITIATING_NODE_TIMEZONE_SETUP: "Initiating node timezone setup",
  /** Message indicating the setting of node timeZone. */
  SETTING_NODE_TIMEZONE: "Setting node timezone",
  /** Message indicating the successful node timeZone setup. */
  NODE_TIMEZONE_SETUP_SUCCEED: "Node timezone setup succeed",
} as const;

/** Represents the labels for the custom errors. */
const ErrorLabels = {
  ESPAPICallValidationError: "ESPAPICallValidationError",
  ESPConfigError: "ESPConfigError",
  ESPProvError: "ESPProvError",
  ESPTokenError: "ESPTokenError",
  ESPStorageAdapterError: "ESPStorageAdapterError",
  ESPValidationError: "ESPValidationError",
  ESPAppPermissionError: "ESPAppPermissionError",
} as const;

/** Represents the HTTP status codes */
const HTTPStatusCodes = {
  UNAUTHORIZED: 401,
} as const;

/**
 * Constant object storing additional info descriptions.
 */
const AdditionalInfo = {
  /** Additional info for the user to login again on unauthorized calls */
  AUTHENTICATION_REQUIRED: "Please login again or re-authenticate",
} as const;

/**
 * An object containing regular expression patterns used for string validation.
 */
const ValidationPatterns = {
  /** Represents the timezone pattern. */
  TIMEZONE: /^[^\s\/]+\/[^\s\/]+$/,
} as const;

/**
 * An object containing keys used as dynamic fields.
 */
const Keys = {
  /** Key for timezone. */
  TIMEZONE: "timeZone",
  /** Key for geo coordinates. */
  GEO_COORDINATES: "geoCoordinates",
} as const;

/**
 * An array containing the types of parameters that are compatible with [simple] time series data.
 */
const TSCompatibleParamTypes = ["float", "int", "bool", "string"];

/**
 * An array containing the types of parameters that support differential calculations.
 */
const TSDifferentialCompatibleParamTypes = ["float", "int"];

/**
 * An object containing parameter property types.
 */
const ParamProperties = {
  /** Property indicating that the parameter supports simple time series data. */
  SIMPLE_TS: "simple_ts",
  /** Property indicating that the parameter supports time series data. */
  TS: "time_series",
} as const;

/**
 * An object containing locale settings.
 */
const Locale = {
  /** Default locale for date formatting */
  DEFAULT: "en-US",
} as const;

/**
 * An object containing time series data related constants.
 */
const TSDataConstants = {
  /** Minimum number of records that can be requested */
  MIN_RESULT_COUNT: 1,
  /** Maximum number of records that can be requested */
  MAX_RESULT_COUNT: 200,
  /** Minimum number of intervals that can be requested */
  MIN_INTERVALS: 1,
} as const;

/**
 * An object containing field names used in API responses.
 */
const APIResponseFields = {
  /** Key for the MQTT host field. */
  MQTT_HOST: "mqtt_host",
} as const;

/**
 * An object containing API request fields.
 */
const APIRequestFields = {
  /** Key for the identity provider. */
  IDENTITY_PROVIDER_KEY: "identity_provider",
  /** Key for the redirect URI. */
  REDIRECT_URI_KEY: "redirect_uri",
  /** Key for the client ID. */
  CLIENT_ID_KEY: "client_id",
  /** Key for the response type. */
  RESPONSE_TYPE_KEY: "response_type",
  /** Value for the response type. */
  OAUTH_CODE_RESPONSE_TYPE: "code",
  /** Key for the grant type. */
  GRANT_TYPE_KEY: "grant_type",
  /** Value for the grant type. */
  OAUTH_CODE_GRANT_TYPE: "authorization_code",
  /** Key for the content type. */
  CONTENT_TYPE_KEY: "content-type",
  /** Value for the content type. */
  URL_ENCODED_CONTENT_TYPE: "application/x-www-form-urlencoded",
} as const;

export {
  HTTPMethods,
  APIEndpoints,
  StorageKeys,
  ValidationErrorCodes,
  StorageAdapterErrorCodes,
  ConfigErrorCodes,
  APICallValidationErrorCodes,
  APIOperations,
  TokenErrorCodes,
  Endpoint,
  ProvErrorCodes,
  AppPermissionErrorCodes,
  ServiceType,
  ProtocolType,
  StatusMessage,
  DEFAULT_REST_API_VERSION,
  ESPServiceType,
  ESPServiceParamType,
  ESPProvProgressMessages,
  ErrorLabels,
  HTTPStatusCodes,
  AdditionalInfo,
  ValidationPatterns,
  Keys,
  TSCompatibleParamTypes,
  TSDifferentialCompatibleParamTypes,
  ParamProperties,
  Locale,
  TSDataConstants,
  APIResponseFields,
  APIRequestFields,
};
