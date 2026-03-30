// Styled text input with icon and error support
import React from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  useColorScheme,
  TextInputProps,
} from "react-native";
import { COLORS } from "@/lib/constants";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({ label, error, icon, style, ...props }: InputProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            { color: isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary },
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: isDark ? "#27272a" : "#f9fafb",
            borderColor: error
              ? COLORS.error
              : isDark
              ? COLORS.dark.border
              : "#e5e7eb",
          },
        ]}
      >
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          placeholderTextColor={isDark ? "#71717a" : "#9ca3af"}
          style={[
            styles.input,
            { color: isDark ? COLORS.dark.text : COLORS.light.text },
            icon ? styles.inputWithIcon : undefined,
            style,
          ]}
          {...props}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 14,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  error: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
