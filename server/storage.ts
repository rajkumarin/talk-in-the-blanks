import { FormField, FormData, InsertFormField, InsertFormData } from "@shared/schema";

export interface IStorage {
  getFormFields(): Promise<FormField[]>;
  getFormField(id: number): Promise<FormField | undefined>;
  createFormField(field: InsertFormField): Promise<FormField>;
  storeFormData(data: InsertFormData): Promise<FormData>;
}

export class MemStorage implements IStorage {
  private formFields: Map<number, FormField>;
  private formData: Map<number, FormData>;
  private currentFieldId: number;
  private currentDataId: number;

  constructor() {
    this.formFields = new Map();
    this.formData = new Map();
    this.currentFieldId = 1;
    this.currentDataId = 1;

    // Initialize with some default form fields
    const defaultFields: InsertFormField[] = [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "phone", label: "Phone Number", type: "tel", required: false },
      { name: "message", label: "Message", type: "textarea", required: false },
    ];

    defaultFields.forEach(field => this.createFormField(field));
  }

  async getFormFields(): Promise<FormField[]> {
    return Array.from(this.formFields.values());
  }

  async getFormField(id: number): Promise<FormField | undefined> {
    return this.formFields.get(id);
  }

  async createFormField(field: InsertFormField): Promise<FormField> {
    const id = this.currentFieldId++;
    const newField = { ...field, id };
    this.formFields.set(id, newField);
    return newField;
  }

  async storeFormData(data: InsertFormData): Promise<FormData> {
    const id = this.currentDataId++;
    const newData = { ...data, id };
    this.formData.set(id, newData);
    return newData;
  }
}

export const storage = new MemStorage();
