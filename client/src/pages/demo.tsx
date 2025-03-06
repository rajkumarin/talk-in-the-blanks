import { TalkInTheBlanks } from "@/lib/talk-in-the-blanks";

const demoFields = [
  { name: "name", label: "Full Name", type: "text", required: true },
  { name: "email", label: "Email Address", type: "email", required: true },
  { name: "phone", label: "Phone Number", type: "tel", required: false },
  { name: "message", label: "Message", type: "textarea", required: false },
];

export default function Demo() {
  const handleSubmit = (data: Record<string, any>) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Talk in the Blanks Demo</h1>
          <p className="text-muted-foreground">
            Example usage of Talk in the Blanks
          </p>
        </div>

        <TalkInTheBlanks
          fields={demoFields}
          onSubmit={handleSubmit}
          className="space-y-4"
        />
      </div>
    </div>
  );
}