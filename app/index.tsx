import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import React from "react";

const HomeScreen = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  if (isSignedIn) {
    console.log("Yes logged in");
    return <Redirect href={"/(root)/(tabs)/home"} />;
  }
  console.log("Not logged in");
  return <Redirect href="/(auth)/welcome" />;
};

export default HomeScreen;
