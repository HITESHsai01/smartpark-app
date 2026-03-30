// Gradient circle avatar with user initial
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GRADIENT } from "@/lib/constants";
import { getInitial } from "@/lib/utils";

interface AvatarProps {
  name: string | null | undefined;
  size?: number;
}

export default function Avatar({ name, size = 40 }: AvatarProps) {
  const initial = getInitial(name);

  return (
    <LinearGradient
      colors={[...GRADIENT.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={[styles.initial, { fontSize: size * 0.4 }]}>
        {initial}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
