import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Paper,
  Typography,
  Chip,
} from "@mui/material";
import type { FormField, FieldType, ValidationRule } from "../types/formTypes";
import { extractParentsFromExpression } from "../utils/derived";
import { v4 as uuidv4 } from "uuid";

interface Props {
  field: FormField;
  allFields: FormField[];
  onChange: (id: string, changes: Partial<FormField>) => void;
}

const fieldTypes: FieldType[] = [
  "text",
  "number",
  "textarea",
  "select",
  "radio",
  "checkbox",
  "date",
];

export default function FieldEditor({ field, allFields, onChange }: Props) {
  const [local, setLocal] = useState<FormField>(field);

  useEffect(() => setLocal(field), [field]);

  const commit = (changes: Partial<FormField>) => {
    const merged = { ...local, ...changes };
    setLocal(merged);
    onChange(field.id, changes);
  };

  const setValidation = (
    type: ValidationRule["type"],
    value?: string | number
  ) => {
    let rules = local.validations ? [...local.validations] : [];
    const idx = rules.findIndex((r) => r.type === type);

    if (idx >= 0) {
      rules.splice(idx, 1);
    } else {
      if (type === "required") {
        rules.push({ id: uuidv4(), type: "required", message: "Required" });
      } else {
        rules.push({ id: uuidv4(), type, value, message: undefined });
      }
    }

    commit({ validations: rules });
  };

  const onExpressionChange = (expr: string) => {
    const parents = extractParentsFromExpression(expr);
    commit({ expression: expr, parents });
  };

  const hasValidation = (type: ValidationRule["type"]) =>
    local.validations?.some((v) => v.type === type) ?? false;

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
        <TextField
          label="Label"
          value={local.label}
          onChange={(e) => commit({ label: e.target.value })}
          size="small"
        />
        <Select
          value={local.type}
          onChange={(e) => commit({ type: e.target.value as FieldType })}
          size="small"
        >
          {fieldTypes.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </Select>
        <FormControlLabel
          control={
            <Switch
              checked={local.required ?? false}
              onChange={(e) => commit({ required: e.target.checked })}
            />
          }
          label="Required"
        />
        <TextField
          label="Default value"
          value={local.defaultValue ?? ""}
          onChange={(e) => commit({ defaultValue: e.target.value })}
          size="small"
        />
      </Box>

      <Box mt={2}>
        <Typography variant="subtitle2">Validations</Typography>
        <Box mt={1} display="flex" gap={1} alignItems="center" flexWrap="wrap">
          <Button
            variant={hasValidation("required") ? "contained" : "outlined"}
            onClick={() => setValidation("required")}
          >
            Required
          </Button>
          <Button
            variant={hasValidation("minLength") ? "contained" : "outlined"}
            onClick={() => setValidation("minLength", 3)}
          >
            Min length 3
          </Button>
          <Button
            variant={hasValidation("maxLength") ? "contained" : "outlined"}
            onClick={() => setValidation("maxLength", 50)}
          >
            Max length 50
          </Button>
          <Button
            variant={hasValidation("email") ? "contained" : "outlined"}
            onClick={() => setValidation("email")}
          >
            Email
          </Button>
          <Button
            variant={hasValidation("password") ? "contained" : "outlined"}
            onClick={() => setValidation("password")}
          >
            Password rule
          </Button>
        </Box>
      </Box>

      <Box mt={2}>
        <FormControlLabel
          control={
            <Switch
              checked={local.isDerived ?? false}
              onChange={(e) =>
                commit({
                  isDerived: e.target.checked,
                  parents: e.target.checked ? local.parents ?? [] : [],
                })
              }
            />
          }
          label="Derived field"
        />
        {local.isDerived && (
          <Box mt={1}>
            <Typography variant="caption">
              Use <code>{"{{fieldId}}"}</code> tokens to reference parents.
              Example: <code>{"ageFromDOB({{dob}})"}</code>
            </Typography>
            <TextField
              label="Expression"
              value={local.expression ?? ""}
              onChange={(e) => onExpressionChange(e.target.value)}
              fullWidth
              size="small"
              multiline
              minRows={2}
            />
            <Box mt={1}>
              <Typography variant="body2">Detected parents:</Typography>
              {(local.parents ?? []).map((p) => {
                const f = allFields.find((ff) => ff.id === p);
                return (
                  <Chip
                    key={p}
                    label={f ? f.label : p}
                    size="small"
                    sx={{ mr: 1, mt: 1 }}
                  />
                );
              })}
            </Box>
          </Box>
        )}
      </Box>

      {(local.type === "select" ||
        local.type === "radio" ||
        local.type === "checkbox") && (
        <Box mt={2}>
          <Typography variant="subtitle2">Options</Typography>
          <Box mt={1} display="flex" gap={1}>
            <TextField
              placeholder="Add comma separated"
              size="small"
              onBlur={(e) => {
                const opts = e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
                commit({ options: opts });
              }}
              helperText="Type options separated by comma and blur"
            />
            <Box>
              {(local.options ?? []).map((o) => (
                <Chip key={o} label={o} size="small" sx={{ mr: 1 }} />
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  );
}
