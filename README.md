# React Native Exploring TurboModules

A playground project for exploring TurboModules and Fabric components.

## Tooling

At the moment my environment matches these requirements:

| Tool            | Version | Check Command                 |
| --------------- | ------- | ----------------------------- |
| **Node.js**     | 20.19.4 | `node -v`                     |
| **Ruby**        | 3.2.9   | `ruby -v`                     |
| **JDK**         | 17.0.10 | `javac -version`              |
| **Android SDK** | 36.0.0  | `sdkmanager --list_installed` |
| **CMake**       | 3.13    | `cmake --version`             |
| **Xcode**       | 26.2    | `xcodebuild -version`         |
| **CocoaPods**   | 1.16.2  | `pod --version`               |

> **Note:** if sdkmanager isn't in your PATH or throws a Java error, you can often find the working version here: `$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --list_installed`

## Setup and Running

**Install JS dependencies:**

```sh
yarn install
```

**Install iOS dependencies:**

```sh
bundle install
cd ios && bundle exec pod install && cd ..
```

> **Note:** `pod install` triggers the **Codegen** for iOS. It reads specs from `src/specs/` and generates ObjC++ headers in `ios/build/generated/`.

**Start Metro**
keep this running in a separate terminal:

```sh
yarn start
```

**Run on Android**

```sh
yarn android
```

**Run on iOS**

```sh
yarn ios
```

## Codegen

React Native's Codegen automates the creation of native interfaces from TypeScript specs.

### iOS Codegen

Codegen runs automatically during `pod install`. If you modify a spec file, simply re-run:

```sh
cd ios
bundle exec pod install
```

_Generated files location:_ `ios/build/generated/ios/`

### Android Codegen

Codegen runs automatically during the build. To generate artifacts without building the full app (useful for debugging):

```sh
cd android
./gradlew generateCodegenArtifactsFromSchema
```

_Generated files location:_ `android/app/build/generated/source/codegen/`

## Key Native Paths

| Platform    | Source Code                                      | Generated Code (Do Not Edit)   |
| ----------- | ------------------------------------------------ | ------------------------------ |
| **iOS**     | `ios/*.{h,mm,swift}`                             | `ios/build/generated/ios/`     |
| **Android** | `android/app/src/main/java/com/sampleapp/specs/` | `android/app/build/generated/` |

## Pitfalls

- **Spec Changes:** If you change a `.ts` spec file, you **MUST** re-run `pod install` (iOS) or rebuild (Android) to update the native interfaces.

## Documentation

Everything covered here is well explained in the official docs: [Native Platform](https://reactnative.dev/docs/native-platform)

## C++ TurboModule

`NativeSampleModule` is a C++ TurboModule demonstrating shared logic across iOS and Android.

**1. The Spec (`src/specs/NativeSampleModule.ts`)**
defines the JS interface using TypeScript. Codegen uses this to generate the C++ base class `NativeSampleModuleCxxSpec`.

_Generated location:_

- **iOS**: `ios/build/generated/ios/AppSpecsJSI.h`
- **Android**: `android/app/build/generated/source/codegen/jni/AppSpecs.h`

```typescript
export interface Spec extends TurboModule {
  readonly reverseString: (input: string) => string;
  readonly cubicRoot: (input: string) => number;
  readonly validateAddress: (input: Address) => boolean;
}
```

**2. The Header (`src/shared/NativeSampleModule.h`)**
inherits from the generated `NativeSampleModuleCxxSpec`. Note how we use `jsi::Runtime` and standard C++ types.

```cpp
class NativeSampleModule : public NativeSampleModuleCxxSpec<NativeSampleModule> {
public:
  NativeSampleModule(std::shared_ptr<CallInvoker> jsInvoker);
  std::string reverseString(jsi::Runtime& rt, std::string input);
  int32_t cubicRoot(jsi::Runtime& rt, int64_t input);
  bool validateAddress(jsi::Runtime &rt, jsi::Object input);
};
```

**3. The Implementation (`src/shared/NativeSampleModule.cpp`)**
implements the logic using standard C++ libraries (`<algorithm>`, `<cmath>`). This code is compiled by both Android (via NDK/CMake) and iOS (via Xcode), ensuring identical behavior on both platforms.

```cpp
std::string NativeSampleModule::reverseString(jsi::Runtime& rt, std::string input) {
  return std::string(input.rbegin(), input.rend());
}
```
