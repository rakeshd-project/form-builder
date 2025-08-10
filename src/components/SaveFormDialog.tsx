import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (name: string) => void
}

export default function SaveFormDialog({ open, onClose, onSave }: Props) {
  const [name, setName] = useState('')

  const handleSave = () => {
    if (!name.trim()) return
    onSave(name.trim())
    setName('')
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Save Form</DialogTitle>
      <DialogContent>
        <TextField autoFocus label="Form name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  )
}
