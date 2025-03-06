import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface VoiceButtonProps {
  onStart: () => void;
  onStop: () => void;
  isRecording: boolean;
}

export function VoiceButton({ onStart, onStop, isRecording }: VoiceButtonProps) {
  return (
    <Button
      onClick={isRecording ? onStop : onStart}
      variant={isRecording ? "destructive" : "default"}
      size="lg"
      className="w-full gap-2"
    >
      {isRecording ? (
        <>
          <MicOff className="h-5 w-5" />
          Stop Recording
        </>
      ) : (
        <>
          <Mic className="h-5 w-5" />
          Start Recording
        </>
      )}
    </Button>
  );
}
