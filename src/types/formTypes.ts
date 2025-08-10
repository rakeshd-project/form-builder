export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date";

export interface ValidationRule {
  id: string;
  type: "required" | "minLength" | "maxLength" | "email" | "password";
  value?: number | string;
  message?: string;
}

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  defaultValue?: any;
  options?: string[];
  validations?: ValidationRule[];
  isDerived?: boolean;
  parents?: string[];
  expression?: string;
}

export interface FormSchema {
  id: string;
  name: string;
  title?: string;
  fields: FormField[];
  createdAt: string;
}
