mode=${1:-release}
gradle_mode="$(tr '[:lower:]' '[:upper:]' <<< ${mode:0:1})${mode:1}"

if [[ "$mode" != "debug" && "$mode" != "release" ]]; then
  echo "Invalid mode: $mode. Must be 'debug' or 'release'."
  exit 1
fi

yarn expo prebuild -p android

pushd ./android
./gradlew build assemble${gradle_mode} || exit 1
popd

mkdir -p build
rm -rf build/android.apk
cp android/app/build/outputs/apk/$mode/app-$mode.apk build/android.apk
