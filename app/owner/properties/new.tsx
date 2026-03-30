// Add New Property form
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { MapPin, Building, IndianRupee, Car } from "lucide-react-native";
import Toast from "react-native-toast-message";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import { COLORS } from "@/lib/constants";

export default function NewPropertyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [baseRate, setBaseRate] = useState("50");
  const [slots, setSlots] = useState("10");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Property name is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!baseRate || isNaN(Number(baseRate)) || Number(baseRate) <= 0)
      newErrors.baseRate = "Valid rate is required";
    if (!slots || isNaN(Number(slots)) || Number(slots) < 1)
      newErrors.slots = "At least 1 slot";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post("/properties", {
        name: name.trim(),
        address: address.trim(),
        baseRate: Number(baseRate),
        slots: Number(slots),
      });

      Toast.show({
        type: "success",
        text1: "Property Created! 🎉",
        text2: `${name} has been added with ${slots} slots.`,
      });

      router.back();
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Failed",
        text2: err?.message || "Could not create property",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? COLORS.dark.background
            : COLORS.light.background,
        },
      ]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text
        style={[
          styles.subtitle,
          {
            color: isDark
              ? COLORS.dark.textSecondary
              : COLORS.light.textSecondary,
          },
        ]}
      >
        Add your parking property. The address will be geocoded automatically
        for map display.
      </Text>

      <Input
        label="Property Name"
        placeholder="e.g., Downtown Parking Hub"
        value={name}
        onChangeText={setName}
        icon={<Building size={16} color="#9ca3af" />}
        error={errors.name}
      />

      <Input
        label="Address"
        placeholder="Full address with city"
        value={address}
        onChangeText={setAddress}
        icon={<MapPin size={16} color="#9ca3af" />}
        error={errors.address}
        multiline
      />

      <Input
        label="Base Rate (₹ per hour)"
        placeholder="50"
        value={baseRate}
        onChangeText={setBaseRate}
        keyboardType="numeric"
        icon={<IndianRupee size={16} color="#9ca3af" />}
        error={errors.baseRate}
      />

      <Input
        label="Number of Slots"
        placeholder="10"
        value={slots}
        onChangeText={setSlots}
        keyboardType="numeric"
        icon={<Car size={16} color="#9ca3af" />}
        error={errors.slots}
      />

      <View style={styles.buttonArea}>
        <Button
          title="Create Property"
          onPress={handleSubmit}
          loading={loading}
          size="lg"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonArea: { marginTop: 8 },
});
