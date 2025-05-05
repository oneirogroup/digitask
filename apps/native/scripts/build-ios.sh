#!/bin/bash

mode=${1:-release}
echo "Building iOS app in ${mode} mode"

if [[ "$mode" != "debug" && "$mode" != "release" ]]; then
  echo "Invalid mode: $mode. Must be 'debug' or 'release'."
  exit 1
fi
ios_mode="$(tr '[:lower:]' '[:upper:]' <<< "${mode:0:1}")${mode:1}"


# check variables CODE_SIGN_IDENTITY and DEVELOPMENT_TEAM are set
#if [[ -z "$CODE_SIGN_IDENTITY" || -z "$DEVELOPMENT_TEAM" ]]; then
#  echo "Please set IOS_SIGN and IOS_TEAM_ID environment variables."
#  exit 1
#fi

if [ ! -d "ios" ]; then
  yarn expo prebuild -p ios --no-install || (yarn && yarn expo prebuild -p ios --no-install) || exit 1
fi

pushd ./ios || exit 1
if [ ! -d "Pods" ]; then
  echo "📦 Pods didn't found. Installing..."
  pod install || exit 1
fi

xcodebuild -downloadPlatform iOS
  
xcodebuild archive \
  -workspace DigiTask.xcworkspace \
  -scheme DigiTask \
  -sdk iphoneos \
  -configuration Release \
  -archivePath build/DigiTask.xcarchive \
  CODE_SIGN_STYLE=Automatic \
  DEVELOPMENT_TEAM="$DEVELOPMENT_TEAM" || exit 1

xcodebuild -exportArchive \
  -archivePath build/DigiTask.xcarchive \
  -exportOptionsPlist ../exportOptions.plist \
  -exportPath build/ipa || exit 1

popd || exit 1

mkdir -p build
rm -rf build/ios.ipa

APP_PATH=$(find ios/build/Build/Products -name '*.app' | head -n 1)

if [[ -z "$APP_PATH" ]]; then
  echo "Failed to find .app file."
  exit 1
fi

echo "iOS build completed: build/ios.ipa"
