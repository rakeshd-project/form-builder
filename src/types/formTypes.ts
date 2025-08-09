export type FieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'

export interface ValidationRule {
  id: string
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password'
  value?: number | string
  message?: string
}

export interface FormField {
  id: string
  label: string
  type: FieldType
  required?: boolean
  defaultValue?: any
  options?: string[] // for select / radio / checkbox
  validations?: ValidationRule[]
  // Derived field settings:
  isDerived?: boolean
  parents?: string[] // parent field ids
  expression?: string // e.g. "Math.floor((Date.now() - new Date({{dob}}))/31557600000)"
}

export interface FormSchema {
  id: string
  name: string
  title?: string
  fields: FormField[]
  createdAt: string // ISO
}