# ESP Rainmaker Typescript Base SDK

The `@espressif/rainmaker-base-sdk` package provides a foundational SDK to help mobile app developers quickly integrate with the ESP Rainmaker ecosystem. It enables seamless provisioning, control, and management of devices.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Requirements](#requirements)
- [Installation](#installation)
  - [Package Manager](#package-manager)
  - [Local Installation](#local-installation)
- [Usage](#usage)
- [License](#license)
- [API Documentation](https://espressif.github.io/esp-rainmaker-app-sdk-ts/)

## Overview

The `@espressif/rainmaker-base-sdk` package is designed to accelerate app development by providing a unified API for interacting with the ESP Rainmaker platform. With support for different communication transports, developers can seamlessly integrate features such as provisioning, device control, and discovery into their apps.

The SDK provides:

- Native module support with adapter interfaces for iOS and Android.
- Support for various transport modes (currently local and cloud).
- A modular design with separate modules for user management, device management, and group management.

## Key Features

- [x] **Provisioning and Discovery:** Support for device provisioning and discovery via native modules with customizable adapter interfaces.
- [x] **Local and Cloud Communication:** Control devices locally, with automatic fallback to cloud communication for updates and retrieval of the latest parameters.
- [x] **Cross-Platform Compatibility:** Works with React Native and other cross-platform frameworks.
- [x] **Extensible Modules:** Provides modular APIs for user, device, and group management.
- [ ] **Matter Protocol Support:** Future-proof your app with Matter protocol support (planned).

## Requirements

Before installing the `@espressif/rainmaker-base-sdk` package, ensure you meet the following prerequisites:

- **Node.js**: Version 20.17.0 or higher is recommended.
- **Package Manager**: Any one from npm, yarn, or pnpm installed.

## Installation

### Package Manager

To install the latest version of the `@espressif/rainmaker-base-sdk` package from the npm registry, you can use your preferred package manager:

#### Using npm:

```bash
npm install @espressif/rainmaker-base-sdk
```

#### Using Yarn:

```bash
yarn add @espressif/rainmaker-base-sdk
```

#### Using pnpm:

```bash
pnpm add @espressif/rainmaker-base-sdk
```

### Local Installation

To build and install the package locally for development and testing:

1. Clone the repository

2. Check out the appropriate branch:

   ```bash
   git checkout main
   ```

3. Ensure you are using Node.js v20.17.0 or higher. If you have `nvm` installed, you can run:

   ```bash
   nvm use
   ```

   If you don’t have `nvm`, please install Node.js v20.17.0 or a higher version manually.

4. Install the required dependencies using Yarn:

   ```bash
   yarn install
   ```

5. Build the package:

   ```bash
   yarn run build
   ```

6. Create a tarball for testing locally:

   ```bash
   yarn pack
   ```

7. Add the tarball to your project:

   ```bash
   yarn add <PATH_TO_PACK_TARBALL_FILE>
   ```

After installation, you can import and configure the SDK in your project as shown in the usage examples below.

## Usage

### User Login Usage Example

Below is a step-by-step guide to logging in a user using the `@espressif/rainmaker-base-sdk` SDK:

1. **Import the SDK**

   Begin by importing the `ESPRMBase` class from the `@espressif/rainmaker-base-sdk` package.

   ```javascript
   import { ESPRMBase } from "@espressif/rainmaker-base-sdk";
   ```

2. **Configure the SDK**

   Use the `configure` method to initialize the SDK with the required base URL and API version.

   ```javascript
   ESPRMBase.configure({
     baseUrl: "https://api.rainmaker.espressif.com",
     version: "v1",
   });
   ```

3. **Get an Instance of the Authentication Module**

   Obtain an instance of the authentication module by calling `getAuthInstance()` on the `ESPRMBase` class.

   ```javascript
   const authInstance = ESPRMBase.getAuthInstance();
   ```

4. **Attempt User Login**

   Call the `login` method on the authentication instance, passing the username and password as arguments.
   Handle the response or any potential errors using a try-catch block.

   ```javascript
   try {
     const resp = await authInstance.login("<USERNAME>", "<PASSWORD>");
     console.log(resp); // Log the response on successful login
   } catch (error) {
     console.log(error); // Handle and log any errors during login
   }
   ```

5. **Review the Login Response**

   The `login` method returns a promise. On successful resolution, it provides the user's instance.
   Ensure you properly log or handle the response in your application.

## License

This project is licensed under the Apache 2.0 license - see the [LICENSE](LICENSE) file for details.
