import { Text, View } from "react-native";

import { Block } from "@mdreal/ui-kit";
import { useQuery } from "@tanstack/react-query";

import { ProfileViewData } from "../../../components/profile";
import { ProfileData } from "../../../types/backend/profile-data";
import { cache } from "../../../utils/cache";
import { formatPhoneNumber } from "../../../utils/format-phone-number";

export default function UserProfileData() {
  const { data: userProfileData } = useQuery<ProfileData>({
    queryKey: [cache.user.profile]
  });
  if (!userProfileData) {
    return (
      <View>
        <Text>User not found</Text>
      </View>
    );
  }

  console.log("user-profile-data.tsx: userProfileData", userProfileData);

  return (
    <Block.Scroll className="p-4" contentClassName="flex gap-4">
      <ProfileViewData
        name="full_name"
        value={`${userProfileData.first_name} ${userProfileData.last_name}`}
        title="Ad Soyad"
      />
      <ProfileViewData name="region" value={userProfileData.group.region} title="Region" />
      <ProfileViewData name="group" value={userProfileData.group.group} title="Qrup" />

      <View />

      <ProfileViewData name="group" value={formatPhoneNumber(userProfileData.phone)} title="Phone Number" />
      <ProfileViewData name="group" value={userProfileData.email} title="Mail Address" />
    </Block.Scroll>
  );
}
