export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isSupported: boolean;

  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.isSupported = !!SpeechRecognition;
    
    if (this.isSupported) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
    }
  }

  start(
    onResult: (text: string, isFinal: boolean) => void,
    onError: (error: string) => void
  ): boolean {
    if (!this.isSupported || !this.recognition) {
      onError("Speech recognition is not supported in this browser");
      return false;
    }

    this.recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      onResult(transcript, result.isFinal);
    };

    this.recognition.onerror = (event) => {
      onError(`Speech recognition error: ${event.error}`);
    };

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      onError(`Failed to start speech recognition: ${error}`);
      return false;
    }
  }

  stop() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
    }
  }
}
