// Profile screen — user info, change password, sign out, partner link
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser, useClerk } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";
import {
  LogOut,
  Lock,
  Briefcase,
  ChevronRight,
  Mail,
  User as UserIcon,
  Settings,
} from "lucide-react-native";
import Toast from "react-native-toast-message";
import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { COLORS } from "@/lib/constants";

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/sign-in");
        },
      },
    ]);
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      Toast.show({
        type: "error",
        text1: "Invalid password",
        text2: "Password must be at least 8 characters",
      });
      return;
    }

    setPasswordLoading(true);
    try {
      await user?.updatePassword({
        currentPassword,
        newPassword,
      });
      Toast.show({
        type: "success",
        text1: "Password Updated",
        text2: "Your password has been changed successfully",
      });
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Failed",
        text2: err?.errors?.[0]?.longMessage || "Could not update password",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={[
              styles.headerTitle,
              { color: isDark ? COLORS.dark.text : COLORS.light.text },
            ]}
          >
            Profile
          </Text>
        </View>

        {/* User Info Card */}
        <Card style={styles.userCard}>
          <View style={styles.userRow}>
            <Avatar name={user?.firstName} size={56} />
            <View style={styles.userInfo}>
              <Text
                style={[
                  styles.userName,
                  { color: isDark ? COLORS.dark.text : COLORS.light.text },
                ]}
              >
                {user?.firstName} {user?.lastName}
              </Text>
              <View style={styles.emailRow}>
                <Mail size={14} color="#9ca3af" />
                <Text style={styles.userEmail}>
                  {user?.emailAddresses?.[0]?.emailAddress}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {/* Change Password */}
          <TouchableOpacity
            onPress={() => setShowPasswordForm(!showPasswordForm)}
          >
            <Card style={styles.menuItem}>
              <View style={styles.menuRow}>
                <View style={[styles.menuIcon, { backgroundColor: "#7c3aed15" }]}>
                  <Lock size={18} color="#7c3aed" />
                </View>
                <Text
                  style={[
                    styles.menuText,
                    { color: isDark ? COLORS.dark.text : COLORS.light.text },
                  ]}
                >
                  Change Password
                </Text>
                <ChevronRight size={18} color="#9ca3af" />
              </View>
            </Card>
          </TouchableOpacity>

          {/* Password Form */}
          {showPasswordForm && (
            <Card style={styles.passwordForm}>
              <Input
                label="Current Password"
                placeholder="Enter current password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                icon={<Lock size={16} color="#9ca3af" />}
              />
              <Input
                label="New Password"
                placeholder="Min 8 characters"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                icon={<Lock size={16} color="#9ca3af" />}
              />
              <Button
                title="Update Password"
                onPress={handleChangePassword}
                loading={passwordLoading}
                size="md"
              />
            </Card>
          )}

          {/* Become a Partner */}
          <Link href="/owner/sign-up" asChild>
            <TouchableOpacity>
              <Card style={styles.menuItem}>
                <View style={styles.menuRow}>
                  <View
                    style={[styles.menuIcon, { backgroundColor: "#f9731615" }]}
                  >
                    <Briefcase size={18} color="#f97316" />
                  </View>
                  <Text
                    style={[
                      styles.menuText,
                      { color: isDark ? COLORS.dark.text : COLORS.light.text },
                    ]}
                  >
                    Become a Partner
                  </Text>
                  <ChevronRight size={18} color="#9ca3af" />
                </View>
              </Card>
            </TouchableOpacity>
          </Link>

          {/* Sign Out */}
          <TouchableOpacity onPress={handleSignOut}>
            <Card style={styles.menuItem}>
              <View style={styles.menuRow}>
                <View
                  style={[styles.menuIcon, { backgroundColor: "#ef444415" }]}
                >
                  <LogOut size={18} color="#ef4444" />
                </View>
                <Text style={[styles.menuText, { color: "#ef4444" }]}>
                  Sign Out
                </Text>
                <ChevronRight size={18} color="#9ca3af" />
              </View>
            </Card>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 20, paddingHorizontal: 4 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  userCard: { marginBottom: 24 },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  userInfo: { flex: 1 },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  userEmail: { fontSize: 13, color: "#9ca3af" },
  menuSection: { gap: 10 },
  menuItem: { padding: 14 },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  passwordForm: {
    padding: 16,
  },
});
