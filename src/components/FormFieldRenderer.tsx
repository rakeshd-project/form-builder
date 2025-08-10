import {
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormGroup,
} from "@mui/material";
import type { FormField } from "../types/formTypes";

interface Props {
  field: FormField;
  value: any;
  onChange: (id: string, value: any) => void;
  error?: string | null;
}

export default function FormFieldRenderer({
  field,
  value,
  onChange,
  error,
}: Props) {
  const common = {
    label: field.label,
    value: value ?? "",
    onChange: (e: any) => onChange(field.id, e.target.value),
    helperText: error ?? undefined,
    error: !!error,
    fullWidth: true,
    disabled: field.isDerived,
  };

  if (
    field.type === "text" ||
    field.type === "number" ||
    field.type === "date"
  ) {
    return (
      <TextField
        {...common}
        type={
          field.type === "number"
            ? "number"
            : field.type === "date"
            ? "date"
            : "text"
        }
        variant="outlined"
        size="small"
        label={field.type === "date" && value === "" ? "" : field.label}
      />
    );
  } else if (field.type === "textarea") {
    return <TextField {...common} multiline minRows={3} size="small" />;
  } else if (field.type === "select") {
    return (
      <TextField select {...common} size="small">
        {(field.options ?? []).map((o) => (
          <MenuItem key={o} value={o}>
            {o}
          </MenuItem>
        ))}
      </TextField>
    );
  } else if (field.type === "radio") {
    return (
      <RadioGroup
        value={value ?? ""}
        onChange={(e) => onChange(field.id, e.target.value)}
      >
        {(field.options ?? []).map((o) => (
          <FormControlLabel key={o} value={o} control={<Radio />} label={o} />
        ))}
      </RadioGroup>
    );
  } else if (field.type === "checkbox") {
    if ((field.options ?? []).length > 0) {
      return (
        <FormGroup>
          {(field.options ?? []).map((o) => (
            <FormControlLabel
              key={o}
              control={
                <Checkbox
                  checked={Array.isArray(value) ? value.includes(o) : false}
                  onChange={(e) => {
                    const arr = Array.isArray(value) ? [...value] : [];
                    if (e.target.checked) arr.push(o);
                    else {
                      const idx = arr.indexOf(o);
                      if (idx >= 0) arr.splice(idx, 1);
                    }
                    onChange(field.id, arr);
                  }}
                />
              }
              label={o}
            />
          ))}
        </FormGroup>
      );
    } else {
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={!!value}
              onChange={(e) => onChange(field.id, e.target.checked)}
            />
          }
          label={field.label}
        />
      );
    }
  }

  return null;
}
