import { Routes, Route, Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material'
import CreatePage from './pages/CreatePage'
import PreviewPage from './pages/PreviewPage'
import MyFormsPage from './pages/MyFormsPage'

export default function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Form Builder
          </Typography>
          <Button color="inherit" component={Link} to="/create">Create</Button>
          <Button color="inherit" component={Link} to="/preview">Preview</Button>
          <Button color="inherit" component={Link} to="/myforms">My Forms</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<CreatePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/myforms" element={<MyFormsPage />} />
        </Routes>
      </Container>
    </>
  )
}
