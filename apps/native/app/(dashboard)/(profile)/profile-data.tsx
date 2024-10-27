import { Text, View } from "react-native";
import { useRecoilValue } from "recoil";

import { profileAtom } from "@digitask/shared-lib/atoms/backend/accounts/profile";
import { ProfileViewData } from "@digitask/shared-lib/components/profile";
import { formatPhoneNumber } from "@digitask/shared-lib/utils/format-phone-number";
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

      <ProfileViewData name="group" value={formatPhoneNumber(userProfile.phone)} title="Phone Number" />
      <ProfileViewData name="group" value={userProfile.email} title="Mail Address" />
    </Block.Scroll>
  );
}
