import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { FormField, FormSchema } from '../types/formTypes'
import { loadSavedForms, saveFormToStorage } from '../utils/localStorage'
import { v4 as uuidv4 } from 'uuid'

interface BuilderState {
  currentFields: FormField[]
  savedForms: FormSchema[]
}

const initialState: BuilderState = {
  currentFields: [],
  savedForms: loadSavedForms(),
}

const slice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    setFields(state, action: PayloadAction<FormField[]>) {
      state.currentFields = action.payload
    },
    addField(state, action: PayloadAction<Partial<FormField>>) {
      const newField: FormField = {
        id: uuidv4(),
        label: action.payload.label ?? 'Untitled',
        type: (action.payload.type as any) ?? 'text',
        required: action.payload.required ?? false,
        defaultValue: action.payload.defaultValue ?? '',
        options: action.payload.options ?? [],
        validations: action.payload.validations ?? [],
        isDerived: action.payload.isDerived ?? false,
        parents: action.payload.parents ?? [],
        expression: action.payload.expression ?? '',
      }
      state.currentFields.push(newField)
    },
    updateField(state, action: PayloadAction<{ id: string; changes: Partial<FormField> }>) {
      const idx = state.currentFields.findIndex((f) => f.id === action.payload.id)
      if (idx >= 0) {
        state.currentFields[idx] = { ...state.currentFields[idx], ...action.payload.changes }
      }
    },
    removeField(state, action: PayloadAction<string>) {
      state.currentFields = state.currentFields.filter((f) => f.id !== action.payload)
    },
    moveField(state, action: PayloadAction<{ from: number; to: number }>) {
      const arr = state.currentFields
      const [moved] = arr.splice(action.payload.from, 1)
      arr.splice(action.payload.to, 0, moved)
      state.currentFields = [...arr]
    },
    clearBuilder(state) {
      state.currentFields = []
    },
    saveForm(state, action: PayloadAction<{ name: string }>) {
      const newSchema: FormSchema = {
        id: uuidv4(),
        name: action.payload.name,
        title: action.payload.name,
        fields: state.currentFields,
        createdAt: new Date().toISOString(),
      }
      state.savedForms.push(newSchema)
      saveFormToStorage(state.savedForms)
    },
    loadFormIntoBuilder(state, action: PayloadAction<string>) {
      const f = state.savedForms.find((s) => s.id === action.payload)
      if (f) {
        state.currentFields = f.fields.map((x) => ({ ...x }))
      }
    },
    setSavedForms(state, action: PayloadAction<FormSchema[]>) {
      state.savedForms = action.payload
    },
    deleteSavedForm(state, action: PayloadAction<string>) {
      state.savedForms = state.savedForms.filter((s) => s.id !== action.payload)
      saveFormToStorage(state.savedForms)
    },
  },
})

export const {
  setFields,
  addField,
  updateField,
  removeField,
  moveField,
  clearBuilder,
  saveForm,
  loadFormIntoBuilder,
  setSavedForms,
  deleteSavedForm,
} = slice.actions

export default slice.reducer
