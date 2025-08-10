import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  loadFormIntoBuilder,
  deleteSavedForm,
} from "../slices/formBuilderSlice";
import { useNavigate } from "react-router-dom";

export default function MyFormsPage() {
  const { savedForms } = useSelector((s: RootState) => s.formBuilder);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openPreview = (id: string) => {
    dispatch(loadFormIntoBuilder(id));
    navigate("/preview");
  };

  const handleDelete = (id: string) => {
    dispatch(deleteSavedForm(id));
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        My Forms
      </Typography>
      <Paper sx={{ p: 2 }}>
        {savedForms.length === 0 ? (
          <Typography>No saved forms yet.</Typography>
        ) : (
          <List>
            {savedForms.map((s) => (
              <ListItem
                key={s.id}
                secondaryAction={
                  <>
                    <IconButton edge="end" onClick={() => openPreview(s.id)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDelete(s.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={s.name}
                  secondary={new Date(s.createdAt).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>
        )}
        <Box mt={2}>
          <Button href="/create">Create new form</Button>
        </Box>
      </Paper>
    </Box>
  );
}
