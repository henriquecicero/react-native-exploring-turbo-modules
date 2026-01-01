# AGENTS

## Overview

This is a **exploration project** for React Native's new architecture, specifically focusing on:

- **TurboModules**: The new native module system that provides synchronous, type-safe communication between JavaScript and native code (replacing the legacy NativeModules bridge).
- **Fabric Components**: The new rendering system for creating native UI components with direct, synchronous access from React.

The project serves as a reference implementation demonstrating how to build and integrate custom native modules and components using React Native codegen system.

## Languages & Technologies

| Layer                     | Language            | Purpose                                                  |
| ------------------------- | ------------------- | -------------------------------------------------------- |
| **JavaScript/TypeScript** | TS                  | UI components, specs, and business logic                 |
| **iOS Native**            | Objective-C++ (.mm) | Fabric component view managers and TurboModule providers |
| **iOS Native**            | Swift               | TurboModule implementations (e.g., NativeLocalStorage)   |
| **Android Native**        | Kotlin              | TurboModules, Fabric view managers, and components       |
| **Shared**                | C++                 | Optional cross-platform native logic (see `shared/`)     |

React Native's **codegen** reads TypeScript specs and generates native interfaces (Objective-C++ protocols for iOS, Java interfaces for Android) that native code must implement.

## What We're Building

### TurboModules (Native Modules)

1. **NativeSampleModule** – Demonstrates basic TurboModule patterns:

   - `reverseString()`: String manipulation in native code
   - `cubicRoot()`: Numeric computation
   - `validateAddress()`: Complex object type handling with custom `Address` type

2. **NativeLocalStorage** – A localStorage-like API with:
   - `setItem()`, `getItem()`, `removeItem()`, `clear()` methods
   - Event emitter pattern (`onKeyAdded`) for reactive updates

### Fabric Components (Native Views)

1. **NativeWebView** – Custom web view with:

   - `sourceURL` prop for loading URLs
   - `onScriptLoaded` bubbling event for load status

2. **NativeCounterView** – Interactive native counter with:

   - `label` and `count` props
   - `onPress` bubbling event with count payload

3. **NativePDFView** – PDF rendering component with:
   - `sourceURL`, `page`, `scale`, `pagingEnabled` props
   - `onLoad`, `onPageChanged`, `onError` events

## Project Structure

```
src/
├── App.tsx                    # Main demo app
├── Theme.ts                   # Shared UI styles
├── specs/                     # Codegen specifications (TypeScript interfaces)
│   ├── NativeSampleModule.ts
│   ├── NativeLocalStorage.ts
│   ├── NativeCounterView.ts
│   ├── NativeWebView.ts
│   └── NativePDFView.ts
├── components/                # React wrappers for Fabric components
│   ├── CounterView.tsx
│   ├── WebView.tsx
│   ├── PDFView.tsx
│   └── BublingEventView.tsx
├── modules/                   # UI demos for TurboModules
│   ├── LocalStorageView.tsx
│   └── SampleModuleView.tsx
└── shared/                    # Shared C++ code

ios/                           # iOS native implementations
├── RCTNative*.h/.mm           # Fabric component implementations
├── Native*Provider.h/.mm      # TurboModule providers
└── *.swift                    # Swift implementations

android/app/src/main/java/     # Android native implementations
└── com/sampleapp/specs/       # Kotlin TurboModules & Fabric components
```

## Codegen Workflow

Specs in `src/specs/` define the contract between JS and native code. React Native's codegen generates:

- TypeScript types for JS consumption
- Native interfaces (ObjC++/Java) for implementation

### Spec Conventions

- Use `CodegenTypes` for precise types: `Int32`, `Double`, `Float`, etc.
- Avoid plain `number` (ambiguous for native code)
- Events use `CodegenTypes.BubblingEventHandler<T>` or `DirectEventHandler<T>`

### Adding a TurboModule

1. Create spec in `src/specs/Native<Name>.ts`
2. Update `package.json` → `codegenConfig.ios.modulesProvider`
3. iOS: Add `<Name>Provider.h/.mm` in `ios/`, include in Xcode project
4. Android: Add `Native<Name>Module.kt` + `Native<Name>Package.kt`, register in `MainApplication.kt`

### Adding a Fabric Component

1. Create spec in `src/specs/Native<Name>.ts` using `codegenNativeComponent`
2. Update `package.json` → `codegenConfig.ios.componentProvider`
3. iOS: Implement `RCTNative<Name>.h/.mm` in `ios/`
4. Android: Add `Native<Name>View.kt` + `Native<Name>ViewManager.kt` + package, register in `MainApplication.kt`
5. Keep event names consistent between spec and native (`getExportedCustomBubblingEventTypeConstants()` on Android)

## Commands

| Command        | Description                       |
| -------------- | --------------------------------- |
| `yarn start`   | Start Metro bundler               |
| `yarn ios`     | Build and run on iOS simulator    |
| `yarn android` | Build and run on Android emulator |
| `yarn test`    | Run Jest tests                    |
| `yarn lint`    | Run ESLint                        |

**iOS first-time setup:**

```sh
bundle install
cd ios && bundle exec pod install && cd ..
```

## AI Agent Guidelines

### Reference Implementations

- **TurboModule template**: Use `NativeLocalStorage` as the reference (spec → Swift implementation)
- **Fabric component template**: Use `NativeCounterView` as the reference (spec → ObjC++ view)
- **React wrapper pattern**: See `src/components/CounterView.tsx` for wrapping native views
- **Shared C++ logic**: See `shared/NativeSampleModule.cpp` for cross-platform native code that can be called from both iOS and Android

### Do NOT Edit (Generated/Vendor)

- `ios/Pods/`, `ios/build/`
- `android/.gradle/`, `android/build/`, `android/app/build/`
- `build/generated/`
- `node_modules/`, `vendor/`

### When Making Changes

1. Always update `package.json` → `codegenConfig` when adding new specs
2. Run `yarn test` after changes to verify nothing broke
3. For iOS changes, run `cd ios && bundle exec pod install` to regenerate native code
4. Match event names exactly between TypeScript specs and native implementations
5. Use `CodegenTypes.Int32`, `Double`, etc. instead of plain `number` in specs
