import { View, Text, ImageBackground, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import MEDITATION_IMAGES from "@/constants/meditation-images";
import AppGradient from "@/components/AppGradient";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomButton from "@/components/CustomButton";
import { TimerContext } from "@/context/TimerContext";




const Meditates = () => {
  const { id } = useLocalSearchParams();

  const {duration: secondsRemaining, setDuration} = useContext(TimerContext);
  const [isMeditating, setMeditating] = useState(false);
 




  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (secondsRemaining === 0) {
      setMeditating(false);
      return;
    }

    if (isMeditating) {
      // Save the interval ID to clear it when the component unmounts
      timerId = setTimeout(() => {
        setDuration(secondsRemaining - 1);
      }, 1000);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [secondsRemaining, isMeditating]);



  const toggleMeditationSessionStatus = async () => {
    if(secondsRemaining === 0) setDuration(10);

    setMeditating(!isMeditating); 
  };


  const formattedTimeMinutes = String(Math.floor(secondsRemaining / 60)).padStart(2, "0");

  const formattedTimeSeconds = String(secondsRemaining % 60).padStart(2, "0");


  const handleAdjustDuration = () => {
    if (isMeditating) toggleMeditationSessionStatus();

    router.push("/(modal)/adjust-meditation-duration")

  }

   // Reset timer only when navigating away from the meditation screen
   useFocusEffect(
    React.useCallback(() => {
      return () => {
        // This will only run when you navigate away from the Meditates screen
        setDuration(10);
      };
    }, [setDuration])
  );
  
  return (
    <View className="flex-1">
      <ImageBackground
        source={MEDITATION_IMAGES[Number(id) - 1]}
        resizeMode="cover"
        className="flex-1"
      >
        <AppGradient colors={["transparent", "rgba(0,0,0,0.8)"]}>
          <Pressable
            onPress={() => router.back()}
            className="absolute top-16 left-6 z-10"
          >
            <AntDesign name="leftcircleo" size={50} color="white" />
          </Pressable>

          <View className="flex-1 justify-center">
            <View className="mx-auto bg-neutral-200 rounded-full w-44 h-44 justify-center items-center ">
              <Text className="text-4xl text-blue-800 font-rmono">
                {formattedTimeMinutes}:{formattedTimeSeconds}
              </Text>
            </View>
          </View>

          <View className="mb-5">
            <CustomButton
              title="Adjust Duration"
              onPress={handleAdjustDuration}
            />

            <CustomButton
              title="Start Meditation"
              onPress={toggleMeditationSessionStatus}
              containerStyles="mt-4"
            />
            
          </View>
        </AppGradient>
      </ImageBackground>
    </View>
  );
};

export default Meditates;
