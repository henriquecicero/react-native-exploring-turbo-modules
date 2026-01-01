# react-native-exploring-turbo-modules

A reference for building TurboModules and Fabric components.

## Tooling & Versions

At the moment my environment matches these requirements:

| Tool            | Version             | Check Command              |
| --------------- | ------------------- | -------------------------- |
| **Node.js**     | 20.19.4             | `node -v`                  |
| **Ruby**        | 3.2.9               | `ruby -v`                  |
| **JDK**         | 17.0.10             | `javac -version`           |
| **Android SDK** | 36 (UpsideDownCake) | Android Studio SDK Manager |
| **Xcode**       | 26.2                | `xcodebuild -version`      |
| **CocoaPods**   | 1.16.2              | `pod --version`            |

## Installation & Runing

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
Keep this running in a separate terminal:

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

- **Automatic:** Runs automatically whenever you run `bundle exec pod install`.
- **Manual Trigger:**
  ```sh
  cd ios
  bundle exec pod install
  ```
  _Run this whenever you modify a spec file in `src/specs/`._
  _Generated files location:_ `ios/build/generated/ios/`

### Android Codegen

- **Automatic:** Runs automatically during the Gradle build phase.
- **Manual Trigger:**
  ```sh
  cd android
  ./gradlew generateCodegenArtifactsFromSchema
  ```
  _Useful for debugging generated Java/Kotlin interfaces without building the full app._
  _Generated files location:_ `android/app/build/generated/source/codegen/`

## Key Native Paths

| Platform    | Source Code                                      | Generated Code (Do Not Edit)   |
| ----------- | ------------------------------------------------ | ------------------------------ |
| **iOS**     | `ios/*.{h,mm,swift}`                             | `ios/build/generated/ios/`     |
| **Android** | `android/app/src/main/java/com/sampleapp/specs/` | `android/app/build/generated/` |

## Common Pitfalls

- **Spec Changes:** If you change a `.ts` spec file, you **MUST** re-run `pod install` (iOS) or rebuild (Android) to update the native interfaces.
- **Clean Build:** When in doubt, clean:
  - iOS: `rm -rf ios/build ~/Library/Developer/Xcode/DerivedData`
  - Android: `cd android && ./gradlew clean`
- **Java Version:** Ensure `JAVA_HOME` points to JDK 17. Check with `echo $JAVA_HOME`.
