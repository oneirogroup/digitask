import { Text, View } from "react-native";
import { useRecoilValue } from "recoil";

import { ProfileViewData, formatPhoneNumber, profileAtom } from "@digitask/shared-lib";
import { Block } from "@mdreal/ui-kit";

export default function UserProfileData() {
  const userProfile = useRecoilValue(profileAtom);
  if (!userProfile) {
    return (
      <View>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <Block.Scroll className="p-4" contentClassName="flex gap-4">
      <ProfileViewData name="full_name" value={`${userProfile.first_name} ${userProfile.last_name}`} title="Ad Soyad" />
      <ProfileViewData name="region" value={userProfile.group.region} title="Region" />
      <ProfileViewData name="group" value={userProfile.group.group} title="Qrup" />

      <View />

      <ProfileViewData name="group" value={formatPhoneNumber(userProfile.phone)} title="Telefon nömrəsi" />
      <ProfileViewData name="group" value={userProfile.email} title="Mail adresi" />
    </Block.Scroll>
  );
}
