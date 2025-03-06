import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { VoiceButton } from "./VoiceButton";
import { SpeechRecognitionService } from "@/lib/speech";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FormField as FormFieldType } from "@shared/schema";

const speechService = new SpeechRecognitionService();

export function VoiceForm() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const { toast } = useToast();

  const form = useForm();

  const { data: fields = [] } = useQuery<FormFieldType[]>({
    queryKey: ["/api/form-fields"],
  });

  const analyzeMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest("POST", "/api/analyze-speech", { text });
      return response.json();
    },
    onSuccess: (data) => {
      Object.entries(data).forEach(([field, value]) => {
        form.setValue(field, value);
      });
      toast({
        title: "Form Updated",
        description: "The form has been filled with your speech input",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to process speech input",
        variant: "destructive",
      });
    },
  });

  const handleStart = () => {
    const started = speechService.start(
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal) {
          analyzeMutation.mutate(text);
        }
      },
      (error) => {
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Voice-Enabled Form</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <VoiceButton
          onStart={handleStart}
          onStop={handleStop}
          isRecording={isRecording}
        />

        {transcript && (
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm text-muted-foreground">{transcript}</p>
          </div>
        )}

        <Form {...form}>
          <form className="space-y-4">
            {fields.map((field) => (
              <FormField
                key={field.id}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      {field.type === "textarea" ? (
                        <Textarea {...formField} />
                      ) : (
                        <Input type={field.type} {...formField} />
                      )}
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
