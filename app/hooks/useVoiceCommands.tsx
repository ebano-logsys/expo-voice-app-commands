import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";
import { useEffect, useState } from "react";
import { Command } from "./commandsType";
import * as Speech from 'expo-speech';


export default function useVoiceCommands(commands: Command[]){
    const [transcript, setTranscript] = useState("");
  
    useSpeechRecognitionEvent("result", (event) => {
      setTranscript(event.results[0]?.transcript);
    });
    useSpeechRecognitionEvent("error", (event) => {
      console.log("error code:", event.error, "error messsage:", event.message);
    });
  
    const handleStart = () => {
      ExpoSpeechRecognitionModule.requestPermissionsAsync().then((result) => {
        if (!result.granted) {
          console.warn("Permissions not granted", result);
          return;
        }
        // Start speech recognition
        ExpoSpeechRecognitionModule.start({
          lang: "es-MX",
          interimResults: true,
          maxAlternatives: 1,
          continuous: true,
          requiresOnDeviceRecognition: false,
          addsPunctuation: false,
          contextualStrings: ["Carlsen", "Nepomniachtchi", "Praggnanandhaa"],
        });
      });
    };
  
    useEffect(() => {
      // For some reason Expo doesnt unmount the component :C
      handleStart()
      return () => {
        ExpoSpeechRecognitionModule.abort()
        console.log('Unmounting component');
      }
    }, [])

    useEffect(() => {
        console.log(transcript)
        commands.forEach((command) => {
            const {key, callback, response} = command
            if (transcript.toLowerCase().includes(key.toLowerCase())){
                callback();
                Speech.speak(response)
                setTranscript("")
            }
        })
    }, [transcript, commands])

    return transcript
}