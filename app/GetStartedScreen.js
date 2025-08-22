import StatusCircle from "@/components/ui/StatusCircle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Image, Text, TouchableOpacity, View } from "react-native";

export default function GetStarted() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, logoAnim]);

  const handleGetStarted = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await AsyncStorage.setItem("hasSeenGetStarted", "true");
    } catch (e) {
      console.error("Failed to save hasSeenGetStarted", e);
      // even if it fails, continue to login
    } finally {
      // Use replace so user can't go back to GetStarted
      router.replace("/Login");
      // no need to setSaving(false) because we leave this screen
    }
  };

  return (
    <View className="flex-1">
      <LinearGradient colors={["#FFFFFF", "#FFFFFF"]} className="flex-1">
        {/* Floating background shapes */}
        <View className="absolute -top-12 -right-16 w-52 h-52 bg-blue-300 opacity-20 rounded-full" />
        <View className="absolute -bottom-16 -left-12 w-64 h-64 bg-blue-400 opacity-15 rounded-full" />

        {/* Content */}
        <View className="flex-1 justify-center items-center px-6 pt-14 pb-10">
          {/* Logo */}
          <Animated.View
            style={{ opacity: logoAnim, transform: [{ scale: logoAnim }] }}
            className="mb-8"
          >
           <Image
              source={require("../assets/images/logo.png")}
              className="w-20 h-20 mb-[120px]"
              resizeMode="contain"
            />
          </Animated.View>

          {/* Animated StatusCircle */}
          <Animated.View
            style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
            className="mb-[100px]"
          >
            <StatusCircle />
          </Animated.View>

          {/* Tagline + Button */}
          <View className="items-center w-full space-y-4">
            <Text className="text-center text-lg font-semibold text-blue-900 leading-6 mx-3 mb-[20px]">
              Keep track of all your important documents and get reminded before
              they expire, so you can focus on what matters most
            </Text>

            <TouchableOpacity
              onPress={handleGetStarted}
              activeOpacity={0.85}
              disabled={saving}
              className={`bg-[#4d76c7] py-4 rounded-full w-full shadow-md ${saving ? "opacity-70" : ""}`}
            >
              {saving ? (
                <ActivityIndicator />
              ) : (
                <Text className="text-white text-lg font-semibold text-center tracking-wide">
                  Get Started
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <StatusBar style="dark" />
        </View>
      </LinearGradient>
    </View>
  );
}
