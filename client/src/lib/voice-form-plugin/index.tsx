import { useState } from "react";
import { useForm } from "react-hook-form";
import { VoiceButton } from "./VoiceButton";
import { SpeechRecognitionService } from "./speech";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}

interface VoiceFormPluginProps {
  fields: Field[];
  onSubmit: (data: Record<string, any>) => void;
  className?: string;
  apiEndpoint?: string;
  buttonClassName?: string;
  formClassName?: string;
}

const speechService = new SpeechRecognitionService();

export function VoiceFormPlugin({
  fields,
  onSubmit,
  className = "",
  apiEndpoint = "/api/analyze-speech",
  buttonClassName = "",
  formClassName = "",
}: VoiceFormPluginProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const { toast } = useToast();
  const form = useForm();

  const analyzeMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest("POST", apiEndpoint, { 
        text,
        fields: fields.map(f => ({
          name: f.name,
          label: f.label
        }))
      });
      return response.json();
    },
    onSuccess: (data: Record<string, any>) => {
      Object.entries(data).forEach(([field, value]) => {
        form.setValue(field, value);
      });
      toast({
        title: "Form Updated",
        description: "The form has been filled with your speech input",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to process speech input",
        variant: "destructive",
      });
    },
  });

  const handleStart = () => {
    const started = speechService.start(
      (text: string, isFinal: boolean) => {
        setTranscript(text);
        if (isFinal) {
          analyzeMutation.mutate(text);
        }
      },
      (error: string) => {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
        setIsRecording(false);
      }
    );
    if (started) {
      setIsRecording(true);
    }
  };

  const handleStop = () => {
    speechService.stop();
    setIsRecording(false);
  };

  const handleFormSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <div className={className}>
      <VoiceButton
        onStart={handleStart}
        onStop={handleStop}
        isRecording={isRecording}
        className={buttonClassName}
      />

      {transcript && (
        <div className="bg-muted p-4 rounded-md mt-4">
          <p className="text-sm text-muted-foreground">{transcript}</p>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className={formClassName}>
        {fields.map((field) => (
          <div key={field.name} className="space-y-2 mt-4">
            <label
              htmlFor={field.name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.label}
            </label>
            <input
              {...form.register(field.name)}
              type={field.type}
              id={field.name}
              required={field.required}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        ))}
      </form>
    </div>
  );
}