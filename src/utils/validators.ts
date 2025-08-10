import type { ValidationRule } from "../types/formTypes";

export function runValidations(
  value: any,
  rules: ValidationRule[] | undefined
) {
  if (!rules || rules.length === 0) return null;
  for (const r of rules) {
    if (r.type === "required") {
      if (value === undefined || value === null || value === "")
        return r.message ?? "Required";
    } else if (r.type === "minLength") {
      if (String(value || "").length < (Number(r.value) ?? 0))
        return r.message ?? `Minimum length ${r.value}`;
    } else if (r.type === "maxLength") {
      if (String(value || "").length > (Number(r.value) ?? 999999))
        return r.message ?? `Maximum length ${r.value}`;
    } else if (r.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(value || "")))
        return r.message ?? "Invalid email";
    } else if (r.type === "password") {
      const s = String(value || "");
      if (s.length < 8 || !/\d/.test(s))
        return (
          r.message ?? "Password must be at least 8 chars and contain a number"
        );
    }
  }
  return null;
}
