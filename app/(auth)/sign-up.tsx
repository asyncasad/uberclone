import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ReactNativeModal } from "react-native-modal";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [verification, setVerication] = useState({
    state: "default",
    error: "",
    code: "",
  });
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setVerication({ ...verification, state: "pending" });
    } catch (err) {
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (signUpAttempt.status === "complete") {
        // Todo: Create a database User
        await setActive({ session: signUpAttempt.createdSessionId });
        // router.replace("/");
        setVerication({ ...verification, state: "success" });
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
        setVerication({
          ...verification,
          state: "failed",
          error: "Verification Failed",
        });
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      setVerication({
        ...verification,
        error: err.errors[0].longMessage,
        state: "failed",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 bg-white"
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 bg-white">
            <View className="relative w-full h-[250px]">
              <Image
                source={images.signUpCar}
                className="z-0 w-full h-[250px]"
              />
              <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
                Create your account
              </Text>
            </View>
            <View className="p-5 flex flex-col gap-5">
              <InputField
                label="Name"
                placeholder="Enter your name"
                icon={icons.person}
                value={form.name}
                onChangeText={(value: string) =>
                  setForm({ ...form, name: value })
                }
              />
              <InputField
                label="Email"
                placeholder="Enter your email"
                icon={icons.email}
                value={form.email}
                onChangeText={(value: string) =>
                  setForm({ ...form, email: value })
                }
              />
              <InputField
                label="Password"
                placeholder="Enter your password"
                icon={icons.lock}
                value={form.password}
                secureTextEntry={true}
                onChangeText={(value: string) =>
                  setForm({ ...form, password: value })
                }
              />
              <CustomButton title="Sign Up" onPress={onSignUpPress} />
              {/* O Auth */}
              <Link href="/sign-in">
                <Text className="text-lg text-center">
                  Already have an account?{" "}
                  <Text className="text-primary-500">Sign In</Text>
                </Text>
              </Link>
              <OAuth />
            </View>
          </View>

          {/* Verification Pending Modal */}
          <ReactNativeModal
            onModalHide={() => {
              if (verification.state === "success") setShowSuccessModal(true);
            }}
            isVisible={verification.state === "pending"}
          >
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Text className="text-3xl font-JakartaBold text-center">
                Verification
              </Text>
              <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
                We've sent a verification code to {form.email}
              </Text>
              <InputField
                label="Code"
                icon={icons.lock}
                placeholder="12345"
                value={verification.code}
                keyboardType="numeric"
                onChangeText={(code) => {
                  setVerication({ ...verification, code });
                }}
              />
              {verification.error && (
                <Text className="text-red-500 text-sm mt-1">
                  {verification.error}
                </Text>
              )}
              <CustomButton
                title="Verify email"
                className="bg-success-500 mt-5"
                onPress={onVerifyPress}
              />
            </View>
          </ReactNativeModal>

          {/* Verification Success Modal */}
          <ReactNativeModal isVisible={showSuccessModal}>
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Image
                source={images.check}
                className="w-[110px] h-[110px] mx-auto my-5"
              />
              <Text className="text-3xl font-JakartaBold text-center">
                Verified
              </Text>
              <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
                You have successfully verfied your account
              </Text>
              <CustomButton
                title="Browse Home"
                className="mt-5"
                onPress={() => {
                  router.push("/(root)/(tabs)/home");
                  setShowSuccessModal(false);
                }}
              />
            </View>
          </ReactNativeModal>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const styles = StyleSheet.create({});
