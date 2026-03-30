// Gradient primary button with loading state
import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GRADIENT } from "@/lib/constants";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  fullWidth = true,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 13 },
    md: { paddingVertical: 14, paddingHorizontal: 24, fontSize: 15 },
    lg: { paddingVertical: 18, paddingHorizontal: 32, fontSize: 17 },
  };

  const currentSize = sizeStyles[size];

  if (variant === "primary") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[fullWidth && styles.fullWidth]}
      >
        <LinearGradient
          colors={[...GRADIENT.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.gradient,
            {
              paddingVertical: currentSize.paddingVertical,
              paddingHorizontal: currentSize.paddingHorizontal,
            },
            isDisabled && styles.disabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <View style={styles.content}>
              {icon && <View style={styles.icon}>{icon}</View>}
              <Text
                style={[styles.primaryText, { fontSize: currentSize.fontSize }]}
              >
                {title}
              </Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === "outline") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.7}
        style={[
          styles.outline,
          {
            paddingVertical: currentSize.paddingVertical,
            paddingHorizontal: currentSize.paddingHorizontal,
          },
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#2563eb" size="small" />
        ) : (
          <View style={styles.content}>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text
              style={[styles.outlineText, { fontSize: currentSize.fontSize }]}
            >
              {title}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  // Ghost variant
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.6}
      style={[
        styles.ghost,
        {
          paddingVertical: currentSize.paddingVertical,
          paddingHorizontal: currentSize.paddingHorizontal,
        },
        fullWidth && styles.fullWidth,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#2563eb" size="small" />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text
            style={[styles.ghostText, { fontSize: currentSize.fontSize }]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fullWidth: { width: "100%" },
  gradient: {
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  outline: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  ghost: {
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { marginRight: 8 },
  primaryText: {
    color: "#ffffff",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  outlineText: {
    color: "#2563eb",
    fontWeight: "600",
  },
  ghostText: {
    color: "#2563eb",
    fontWeight: "600",
  },
  disabled: { opacity: 0.5 },
});
