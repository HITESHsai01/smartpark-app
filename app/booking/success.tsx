// Booking success screen — checkmark animation, navigation buttons
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Stack } from "expo-router";
import { CheckCircle } from "lucide-react-native";
import Button from "@/components/ui/Button";
import { COLORS } from "@/lib/constants";

export default function BookingSuccessScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView
        style={[
          styles.safe,
          {
            backgroundColor: isDark
              ? COLORS.dark.background
              : COLORS.light.background,
          },
        ]}
      >
        <View style={styles.content}>
          {/* Animated checkmark */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <View style={styles.checkContainer}>
              <CheckCircle size={80} color="#22c55e" />
            </View>
          </Animated.View>

          {/* Text */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text
              style={[
                styles.title,
                { color: isDark ? COLORS.dark.text : COLORS.light.text },
              ]}
            >
              Booking Confirmed! 🎉
            </Text>
            <Text style={styles.subtitle}>
              Your parking spot has been reserved successfully.{"\n"}
              Have a safe drive!
            </Text>
          </Animated.View>

          {/* Buttons */}
          <Animated.View style={[styles.buttons, { opacity: fadeAnim }]}>
            <Button
              title="Back to Map"
              onPress={() => router.replace("/(tabs)/map")}
              variant="outline"
              size="lg"
            />
            <View style={styles.spacer} />
            <Button
              title="Go Home"
              onPress={() => router.replace("/(tabs)")}
              size="lg"
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  checkContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#22c55e15",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
  },
  buttons: { width: "100%" },
  spacer: { height: 12 },
});
