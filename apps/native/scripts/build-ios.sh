#!/bin/bash

. ./scripts/env.sh

mode=${1:-release}
echo "Building iOS app in ${mode} mode"

if [[ "$mode" != "debug" && "$mode" != "release" ]]; then
  echo "Invalid mode: $mode. Must be 'debug' or 'release'."
  exit 1
fi

# Remove old iOS build
rm -rf ios

# Prebuild iOS project
yarn expo prebuild -p ios || (yarn && yarn expo prebuild -p ios) || exit 1

# Navigate to iOS directory
pushd ./ios || exit 1

# Install CocoaPods dependencies
pod install || exit 1

# Build the app
xcodebuild -workspace DigiTask.xcworkspace \
  -scheme DigiTask \
  -configuration "$(tr '[:lower:]' '[:upper:]' <<< "${mode:0:1}")${mode:1}" \
  -sdk iphoneos \
  -derivedDataPath build || exit 1

popd || exit 1

# Create build directory
mkdir -p build
rm -rf build/ios.ipa

# Export the built app
APP_PATH=$(find ios/build/Build/Products -name '*.app' | head -n 1)

if [[ -z "$APP_PATH" ]]; then
  echo "Failed to find .app file."
  exit 1
fi

# Package the .app into an .ipa
xcrun -sdk iphoneos PackageApplication -v "$APP_PATH" -o "$(pwd)/build/ios.ipa" || exit 1

echo "iOS build completed: build/ios.ipa"
