import type { FormSchema } from '../types/formTypes'

const STORAGE_KEY = 'form-builder:saved-forms'

export function loadSavedForms(): FormSchema[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as FormSchema[]
  } catch {
    return []
  }
}

export function saveFormToStorage(forms: FormSchema[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(forms))
  } catch (e) {
    console.error('Failed to save forms', e)
  }
}
