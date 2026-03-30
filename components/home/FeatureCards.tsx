// Feature cards — Real-time Availability, Secure Booking, Wide Coverage
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
} from "react-native";
import { Clock, Shield, MapPin } from "lucide-react-native";
import Card from "@/components/ui/Card";
import { COLORS } from "@/lib/constants";

const features = [
  {
    title: "Real-time Availability",
    description: "Check live parking slot status and availability in real time.",
    icon: Clock,
    color: "#2563eb",
  },
  {
    title: "Secure Booking",
    description: "Book your spot instantly with secure, hassle-free payments.",
    icon: Shield,
    color: "#7c3aed",
  },
  {
    title: "Wide Coverage",
    description: "Find parking spots across multiple locations near you.",
    icon: MapPin,
    color: "#f97316",
  },
];

export default function FeatureCards() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.sectionTitle,
          { color: isDark ? COLORS.dark.text : COLORS.light.text },
        ]}
      >
        Why SmartPark?
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} style={styles.card}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: feature.color + "15" },
                ]}
              >
                <Icon size={24} color={feature.color} />
              </View>
              <Text
                style={[
                  styles.cardTitle,
                  { color: isDark ? COLORS.dark.text : COLORS.light.text },
                ]}
              >
                {feature.title}
              </Text>
              <Text
                style={[
                  styles.cardDescription,
                  {
                    color: isDark
                      ? COLORS.dark.textSecondary
                      : COLORS.light.textSecondary,
                  },
                ]}
              >
                {feature.description}
              </Text>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    width: 200,
    padding: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});
