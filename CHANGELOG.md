# Changelog

All notable changes to this project will be documented in this file.  
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) and follows the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.

## [v2.1.0]

### Added

- **Assisted Claiming Support**:
  - Introduced assisted claiming flow.

### Enhanced

- **Node Config Information**:
  - Extended node config info to support additional parameters for greater flexibility.

## [v2.0.5]

### Fixed

- **Group Node Mapping & Metadata Alignment**:
  - Corrected the mapping of `nodeIds` to `nodes` in `ESPRMGroupInterface` during group and subgroup creation.
  - Aligned `metadata` field with backend API.

## [v2.0.4]

### Enhanced

- **Update Automation API**: Modified Update Automation API to support node change in events params.

## [v2.0.3]

### Added

- **Provisioning Enhancement**: Automatically add new node to group specified by groupId during provisioning.

### Fixed

- **Group Creation**: Add isPrimaryUser flag to newly created groups.

## [v2.0.2]

### Fixed

- **Transport Config Validation**: Fixed transport config validation logic.

## [v2.0.1]

### Changed

- **Node Parameters**: Converted abstract class to an interface.
  - Enhances compatibility with state management libraries
  - Simplifies extension and integration.

## [v2.0.0]

### Added

- **Adapter-based OAuth Login**: Introduced adapter-based OAuth login functionality for more flexible authentication flows.
- **Primary Parameter Retrieval**: Added API to fetch the primary parameter of an `ESPRMDevice`.
- **Provisioning Enhancements**:
  - Added BLE and location permission adapter support.
  - Introduced customer-id-based BLE device search on the user instance.
  - Added node ID retrieval support in the provisioning flow.
- **Device & Service Parameter Enhancements**:
  - Added support for `valid_strs` with validation.
  - Introduced `bounds` support for service parameters.
  - Added setter and getter support for service parameters.

### Changed

- **Provision Adapter**:
  - Fixed response type for the `connect` method.
- **Device & Service Parameter Classes**:
  - Restructured classes for better maintainability and extensibility.

### Fixed

- **Notification Validation**: Corrected an incorrect validation condition for notification data.

---

## [v1.1.0]

### Added

- **Automation Operations**: Comprehensive automation management capabilities with support for daylight-based and weather-based triggers.

- **Time Series Operations**: Advanced time series data retrieval and analysis with configurable aggregation intervals and filtering options.

- **OTA Operations**: Over-the-Air firmware update management for ESP devices with remote update capabilities and status monitoring.

- **Provisioning Hooks**: Enhanced device onboarding process with support for custom provisioning flows, user-node mapping, and network credential configuration.

## [v1.0.1] - 2025-04-01

### Added

- Post-unauthorized call handling logic.
- Custom data related APIs.
- Set timezone related APIs.

### Changed

- **Refactored `ESPRMBase` Class and Static APIs**:

  - Refactored **ESPRMBase** class to ensure cleaner and more efficient static API structure.

- **Provisioning Manager API Refactor**:

  - Moved **provision manager** APIs to the user level for better access control.

- **Import/Export Refinements**:

  - Improved **import/export** logic for augmented methods and classes to improve extensibility.

- Reduced circular dependencies.

## [v1.0.0] - 2025-01-27

### Added

This is the **initial release** of `@espressif/rainmaker-base-sdk`, designed to accelerate app development by providing a unified API for interacting with the **ESP RainMaker** platform.

#### Core Features:

- **Provisioning & Discovery**:

  - Supports device provisioning and discovery using **native modules** with **customizable adapter interfaces**.

- **Local & Cloud Communication**:

  - Allows seamless device control over **local transport** with an **automatic fallback** to **cloud communication** for updates and retrieval of the latest parameters.

- **Cross-Platform Compatibility**:

  - Designed to work with **React Native** and other cross-platform frameworks.

- **Extensible & Modular Design**:

  - Includes separate **modules** for:
    - **Auth Management**: Handle authentication/authorization related APIs.
    - **User Management**: Handle user related operations.
    - **Device Management**: Manage device interactions, including state updates and control.
    - **Group Management**: Organize and control multiple devices as groups.

- **Native Module Support**:
  - Provides **adapter interfaces** for both **iOS and Android**, ensuring seamless integration with mobile applications.

This release lays the foundation for future enhancements, allowing developers to build apps that integrate seamlessly with **ESP RainMaker** while maintaining **scalability** and **flexibility**.
