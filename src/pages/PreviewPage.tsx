import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Paper, Typography, Grid, Alert } from '@mui/material'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import FormFieldRenderer from '../components/FormFieldRenderer'
import { runValidations } from '../utils/validators'
import { evaluateDerivedExpression } from '../utils/derived'
import { useNavigate } from 'react-router-dom'

export default function PreviewPage() {
  const { currentFields } = useSelector((s: RootState) => s.formBuilder)
  const initialValues = useMemo(() => {
    const m: Record<string, any> = {}
    for (const f of currentFields) {
      m[f.id] = f.defaultValue ?? (f.type === 'checkbox' ? false : '')
    }
    return m
  }, [currentFields])

  const [values, setValues] = useState<Record<string, any>>(initialValues)
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [submitResult, setSubmitResult] = useState<string | null>(null)
  const navigate = useNavigate();

  useEffect(() => setValues(initialValues), [initialValues])

useEffect(() => {
  const newValues = { ...values }
  let changed = false

  const maxIters = 10
  let iter = 0

  while (iter < maxIters) {
    let localChanged = false
    iter++

    for (const f of currentFields) {
      if (f.isDerived && f.expression) {
        const computed = evaluateDerivedExpression(f.expression, newValues, currentFields)

        if (String(computed) !== String(newValues[f.id] ?? '')) {
          newValues[f.id] = computed
          localChanged = true
        }
      }
    }

    if (!localChanged) break
    changed = true
  }

  if (changed) {
    setValues(newValues)
  }
}, [currentFields, values])

  const handleChange = (id: string, v: any) => {
    setValues(s => ({ ...s, [id]: v }))
    setErrors(e => ({ ...e, [id]: null }))
  }

  const validateAll = () => {
    const errs: Record<string, string | null> = {}
    for (const f of currentFields) {
      if (f.isDerived) {
        // derived field computed; still run validations on computed value
      }
      const err = runValidations(values[f.id], f.validations)
      errs[f.id] = err
    }
    setErrors(errs)
    const any = Object.values(errs).some(Boolean)
    return !any
  }

  const handleSubmit = () => {
    const ok = validateAll()
    if (!ok) {
      setSubmitResult('There were validation errors — fix them and try again.')
      return
    }
    setSubmitResult('Form submitted successfully (only schema is saved not the values)')
  }

  if (!currentFields || currentFields.length === 0) {
    return <Alert severity="info">No fields in the builder yet. Go to Create to add fields.</Alert>
  }

  const navigateToCreate = () => {
    navigate("/create")
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Preview</Typography>
      <Paper sx={{ p:2 }}>
        <Grid container spacing={2}>
          {currentFields.map(f => (
            <Grid size={{ xs: 12 }} key={f.id}>
              <FormFieldRenderer
                field={f}
                value={values[f.id]}
                onChange={handleChange}
                error={errors[f.id] ?? null}
              />
            </Grid>
          ))}
        </Grid>
        <Box mt={2} display="flex" gap={1}>
          <Button variant="contained" onClick={handleSubmit}>Submit</Button>
          <Button variant="outlined" onClick={navigateToCreate}>Edit form</Button>
        </Box>
        {submitResult && <Alert sx={{ mt:2 }}>{submitResult}</Alert>}
      </Paper>
    </Box>
  )
}
