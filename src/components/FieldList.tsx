import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { Box, Paper, IconButton, Typography, Tooltip } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { FormField } from "../types/formTypes";

interface Props {
  fields: FormField[];
  onReorder: (from: number, to: number) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function FieldList({
  fields,
  onReorder,
  onSelect,
  onDelete,
}: Props) {
  const handleDragEnd = (res: DropResult) => {
    if (!res.destination) return;
    if (res.source.index === res.destination.index) return;
    onReorder(res.source.index, res.destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="fields-droppable">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {fields.map((f, idx) => (
              <Draggable key={f.id} draggableId={f.id} index={idx}>
                {(p) => (
                  <Paper
                    ref={p.innerRef}
                    {...p.draggableProps}
                    sx={{ p: 1, mb: 1, display: "flex", alignItems: "center" }}
                  >
                    <Box
                      {...p.dragHandleProps}
                      sx={{ mr: 1, display: "flex", alignItems: "center" }}
                    >
                      <DragIndicatorIcon />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1">
                        {f.label}{" "}
                        <Typography component="span" variant="caption">
                          ({f.type})
                        </Typography>
                      </Typography>
                      {f.isDerived && (
                        <Typography variant="caption">Derived</Typography>
                      )}
                    </Box>
                    <Box>
                      <Tooltip title="Edit" arrow placement="top">
                        <IconButton onClick={() => onSelect(f.id)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow placement="top">
                        <IconButton
                          onClick={() => onDelete(f.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
