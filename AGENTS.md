# AGENTS

## Overview
- React Native 0.83 app focused on TurboModules and Fabric components.
- JS/TS codegen specs live in `specs/` and drive native interfaces.

## Layout
- JS/TS UI and demo components: `App.tsx`, `*.tsx` in the repo root.
- iOS native code: `ios/` (ObjC++ `.mm` files for modules/views).
- Android native code: `android/app/src/main/java/com/sampleapp/specs`.
- Shared C++ module sample: `shared/`.

## Codegen + native module conventions
- Specs should use concrete `CodegenTypes` (`Int32`, `Double`, etc.); avoid plain `number`.
- TurboModules:
  - Update `package.json` `codegenConfig.ios.modulesProvider`.
  - iOS: add provider in `ios/` (ObjC++) and ensure it is in the Xcode project.
  - Android: add `Native...Module.kt` and `Native...Package.kt`, then register in `android/app/src/main/java/com/reactnativeexploringturbomodules/MainApplication.kt`.
- Fabric components:
  - Update `package.json` `codegenConfig.ios.componentProvider`.
  - iOS: implement `RCTNative...` view manager/view in `ios/` and add to the Xcode project.
  - Android: add `Native...View.kt`, `Native...ViewManager.kt`, `Native...Package.kt`, register in `MainApplication.kt`.
- Keep event names/payloads in native code consistent with the spec (Android events in `getExportedCustomBubblingEventTypeConstants()`).

## Commands
- JS: `yarn start`, `yarn test`, `yarn lint`.
- Android: `yarn android`.
- iOS: `bundle exec pod install` in `ios/`, then `yarn ios`.

## Generated or vendor code
- Do not edit: `ios/Pods`, `ios/build`, `android/.gradle`, `android/build`, `android/app/build`.
