import StaffReportForm from "@/components/pageComponents/Resort Staff/StaffReportForm";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import { useFocusEffect, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function NewStaffReportScreen() {
  const router = useRouter();
  const [formInstanceKey, setFormInstanceKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setFormInstanceKey((current) => current + 1);
    }, []),
  );

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingTop: 10,
          paddingBottom: 32,
          gap: 16,
        }}
      >
        <View className="flex-row items-start gap-3">
          <Pressable
            onPress={() => router.back()}
            className="h-9 w-9 items-center justify-center"
          >
            <ArrowLeft size={21} color="#0E33F3" />
          </Pressable>
          <View className="flex-1">
            <Text className="font-sans-bold text-2xl text-neutral-dark-1">
              New report
            </Text>
            <Text className="mt-1 text-base text-neutral-grey-1">
              Document the concern clearly for admin review.
            </Text>
          </View>
        </View>

        <StaffReportForm
          key={`general-${formInstanceKey}`}
          onCreated={(reportId) =>
            router.replace({
              pathname: "/resort-staff/(reports)/[reportId]",
              params: { reportId },
            })
          }
        />
      </ScrollView>
    </CustomSafeAreaView>
  );
}
