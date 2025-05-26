#!/bin/bash

mode=${1:-release}
echo "Building iOS app in ${mode} mode"

if [[ "$mode" != "debug" && "$mode" != "release" ]]; then
  echo "Invalid mode: $mode. Must be 'debug' or 'release'."
  exit 1
fi
ios_mode="$(tr '[:lower:]' '[:upper:]' <<< "${mode:0:1}")${mode:1}"


if [ ! -d "ios" ]; then
  yarn expo prebuild -p ios --no-install || (yarn && yarn expo prebuild -p ios --no-install) || exit 1
fi

pushd ./ios || exit 1
if [ ! -d "Pods" ]; then
  echo "📦 Pods didn't found. Installing..."
  pod install || exit 1
fi

fastlane build

popd || exit 1

#mkdir -p build
#rm -rf build/ios.ipa
#
#APP_PATH=$(find ios/build/Build/Products -name '*.app' | head -n 1)
#
#if [[ -z "$APP_PATH" ]]; then
#  echo "Failed to find .app file."
#  exit 1
#fi
#
#echo "iOS build completed: build/ios.ipa"
