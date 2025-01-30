#!/bin/bash

mode=${1:-release}
echo "Building app in ${mode} mode"

if [[ "$mode" != "debug" && "$mode" != "release" ]]; then
  echo "Invalid mode: $mode. Must be 'debug' or 'release'."
  exit 1
fi

# Convert mode to Xcode scheme format
if [[ "$mode" == "release" ]]; then
  build_configuration="Release"
else
  build_configuration="Debug"
fi

# Remove existing iOS build directory
rm -rf ios
yarn expo prebuild -p ios || (yarn && yarn expo prebuild -p ios) || exit 1

# Navigate to the iOS directory
pushd ./ios

# Install dependencies
pod install || exit 1

# Build the iOS app using xcodebuild
xcodebuild -workspace app.xcworkspace \
           -scheme app \
           -configuration $build_configuration \
           -sdk iphoneos \
           -derivedDataPath build || exit 1

popd

# Create output directory
mkdir -p build

# Remove previous build artifacts
rm -rf build/ios.ipa

# Package the app into an IPA
xcodebuild -exportArchive \
           -archivePath ios/build/Build/Products/$build_configuration-iphoneos/app.xcarchive \
           -exportPath build \
           -exportOptionsPlist ios/exportOptions.plist || exit 1

echo "iOS build complete: build/app.ipa"
