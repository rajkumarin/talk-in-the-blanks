import { VoiceForm } from "@/components/voice-form/VoiceForm";

export default function Demo() {
  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Voice Form Demo</h1>
          <p className="text-muted-foreground">
            Start speaking and watch as your words automatically fill the form fields
          </p>
        </div>
        <VoiceForm />
      </div>
    </div>
  );
}
