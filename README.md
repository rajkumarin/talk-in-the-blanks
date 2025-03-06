# Talk in the Blanks

A voice-enabled form filling React plugin using speech recognition and LLM for automated form completion.

## Features

- Voice input for form filling
- Automatic field detection and population
- Support for custom form fields
- Real-time speech-to-text conversion
- Customizable styling
- Built with TypeScript

## Installation

```bash
npm install talk-in-the-blanks
```

## Usage

```tsx
import { TalkInTheBlanks } from 'talk-in-the-blanks';

const MyForm = () => {
  const fields = [
    { name: "name", label: "Full Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "message", label: "Message", type: "textarea", required: false },
  ];

  const handleSubmit = (data) => {
    console.log('Form data:', data);
  };

  return (
    <TalkInTheBlanks
      fields={fields}
      onSubmit={handleSubmit}
      className="my-form-class"
    />
  );
};
```

## Props

- `fields`: Array of form field configurations
  - `name`: Field identifier
  - `label`: Display label
  - `type`: Input type (text, email, tel, textarea, etc.)
  - `required`: Whether the field is required
- `onSubmit`: Callback function when form is submitted
- `className`: Custom CSS class for the form container
- `buttonClassName`: Custom CSS class for the voice button
- `formClassName`: Custom CSS class for the form element
- `apiEndpoint`: Custom endpoint for speech analysis (defaults to "/api/analyze-speech")

## Server Setup

The plugin requires a server endpoint for speech analysis. Example setup:

```typescript
app.post("/api/analyze-speech", async (req, res) => {
  const { text, fields } = req.body;

  // Use OpenAI or other LLM to analyze the speech
  const analysis = await analyzeText(text, fields);

  res.json(analysis);
});
```

## Browser Support

- Chrome/Edge (full support)
- Safari (requires permission)
- Firefox (requires permission)

## License

MIT