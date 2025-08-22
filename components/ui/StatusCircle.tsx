import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const StatusCircle = ({ size = 180, strokeWidth = 14 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useRef(new Animated.Value(0)).current;
  const iconOpacity = useRef(new Animated.Value(1)).current; // blinking animation
  const [colorIndex, setColorIndex] = useState(0);

  const colors = ["#22c55e", "#f59e0b", "#ef4444"] // Green, Yellow, Red

  useEffect(() => {
    const animateCircle = () => {
      Animated.timing(progress, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          progress.setValue(0);
          setColorIndex((prev) => (prev + 1) % colors.length);
          animateCircle();
        }
      });
    };

    animateCircle();
  }, );

  // Icon blinking loop
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconOpacity, {
          toValue: 0.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, );

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        {/* Background ring */}
        <Circle
          stroke="white"
          fill="white"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Animated progress ring */}
        <AnimatedCircle
          stroke={colors[colorIndex]}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>

      {/* Blinking Document Icon */}
      <Animated.View
        style={{
          position: "absolute",
          backgroundColor: "white",
          borderRadius: 50,
          padding: 8,
          opacity: iconOpacity,
        }}
      >
        <MaterialIcons
          name="description"
          size={40}
          color={colors[colorIndex]}
        />
      </Animated.View>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default StatusCircle;
