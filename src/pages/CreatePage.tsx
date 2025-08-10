import { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Divider,
  Alert,
} from "@mui/material";
import FieldEditor from "../components/FieldEditor";
import FieldList from "../components/FieldList";
import SaveFormDialog from "../components/SaveFormDialog";
import {
  addField,
  updateField,
  removeField,
  moveField,
  saveForm,
} from "../slices/formBuilderSlice";
import type { FormField } from "../types/formTypes";
import { detectCycle } from "../utils/derived";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
const useApp = () => {
  const dispatch = useDispatch();
  const state = useSelector((s: RootState) => s.formBuilder);
  return { dispatch, state };
};

export default function CreatePage() {
  const { dispatch, state } = useApp();
  const { currentFields } = state;
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showSave, setShowSave] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addNew = (type: FormField["type"] = "text") => {
    dispatch(addField({ label: "Untitled", type }));
  };

  const handleChange = (id: string, changes: Partial<FormField>) => {
    dispatch(updateField({ id, changes }));
  };

  const handleDelete = (id: string) => {
    dispatch(removeField(id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleReorder = (from: number, to: number) => {
    dispatch(moveField({ from, to }));
  };

  const canSave = !detectCycle(currentFields);

  const handleSave = (name: string) => {
    if (!canSave) {
      setError(
        "Detected cycle in derived fields. Fix parents/expressions before saving."
      );
      setShowSave(false);
      return;
    }
    dispatch(saveForm({ name }));
    setShowSave(false);
  };

  const navigateToPreview = () => {
    navigate("/preview")
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Fields</Typography>
          <Box mt={2}>
            <Button
              variant="contained"
              onClick={() => addNew("text")}
              sx={{ mr: 1 }}
            >
              Add Text
            </Button>
            <Button
              variant="outlined"
              onClick={() => addNew("number")}
              sx={{ mr: 1 }}
            >
              Number
            </Button>
            <Button
              variant="outlined"
              onClick={() => addNew("date")}
              sx={{ mr: 1 }}
            >
              Date
            </Button>
          </Box>
          <Box mt={2}>
            <FieldList
              fields={currentFields}
              onReorder={handleReorder}
              onSelect={setSelectedId}
              onDelete={handleDelete}
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" gap={1}>
            <Button variant="contained" onClick={() => setShowSave(true)}>
              Save Form
            </Button>
            <Button variant="outlined" onClick={navigateToPreview}>
              Preview
            </Button>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {!canSave && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Derived fields form a cycle — cannot save until fixed.
            </Alert>
          )}
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Typography variant="h6">Editor</Typography>
        <Box mt={1}>
          {selectedId ? (
            <FieldEditor
              field={currentFields.find((f) => f.id === selectedId)!}
              allFields={currentFields}
              onChange={(id, c) => handleChange(id, c)}
            />
          ) : (
            <Paper sx={{ p: 2 }}>
              <Typography>Select a field to edit its properties.</Typography>
            </Paper>
          )}
        </Box>
      </Grid>
      <SaveFormDialog
        open={showSave}
        onClose={() => setShowSave(false)}
        onSave={handleSave}
      />
    </Grid>
  );
}
