// Vehicle selector — pick from existing or type a new one
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Car } from "lucide-react-native";
import { COLORS } from "@/lib/constants";

const vehicleTypes = ["CAR", "BIKE", "SUV", "TRUCK"];

interface VehicleSelectorProps {
  selected: string;
  onSelect: (type: string) => void;
}

export default function VehicleSelector({
  selected,
  onSelect,
}: VehicleSelectorProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          { color: isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary },
        ]}
      >
        Vehicle Type
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.optionsRow}
      >
        {vehicleTypes.map((type) => {
          const isActive = selected === type;
          return (
            <TouchableOpacity
              key={type}
              onPress={() => onSelect(type)}
              activeOpacity={0.7}
              style={[
                styles.option,
                {
                  backgroundColor: isActive
                    ? COLORS.primary
                    : isDark
                    ? "#27272a"
                    : "#f3f4f6",
                  borderColor: isActive
                    ? COLORS.primary
                    : isDark
                    ? COLORS.dark.border
                    : "#e5e7eb",
                },
              ]}
            >
              <Car
                size={18}
                color={isActive ? "#fff" : isDark ? "#a3a3a3" : "#6b7280"}
              />
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isActive
                      ? "#fff"
                      : isDark
                      ? COLORS.dark.text
                      : COLORS.light.text,
                  },
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  optionsRow: { gap: 10 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
