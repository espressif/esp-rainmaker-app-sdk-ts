# Changelog

All notable changes to this project will be documented in this file.  
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) and follows the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.

## [v1.0.1] - 2025-03-28

### Added

- Post-unauthorized call handling logic.
- Custom data-related APIs.
- Set timezone-related APIs.

### Changed

- **Refactored `ESPRMBase` class and static APIs**:

  - Removed constructor, making all class properties and methods static.
  - Replaced `this` with the class name in static methods to ensure correct inheritance behavior.

- **Provisioning API Refactor**:

  - Moved provision manager APIs to the user level for better access control.

- **Import/Export Refinements**:

  - Improved import/export logic for augmented methods and classes.
  - Ensured proper augmentation by refining imports/exports.

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
    - **User Management**: Handle authentication and user-related APIs.
    - **Device Management**: Manage device interactions, including state updates and control.
    - **Group Management**: Organize and control multiple devices as groups.

- **Native Module Support**:

  - Provides **adapter interfaces** for both **iOS and Android**, ensuring seamless integration with mobile applications.

This release lays the foundation for future enhancements, allowing developers to build apps that integrate seamlessly with **ESP RainMaker** while maintaining **scalability** and **flexibility**.
