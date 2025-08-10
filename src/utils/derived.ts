import type { FormField } from '../types/formTypes'

export function extractParentsFromExpression(expression: string): string[] {
  const re = /\{\{\s*([a-zA-Z0-9-_]+)\s*\}\}/g
  const set = new Set<string>()
  let m: RegExpExecArray | null
  while ((m = re.exec(expression))) {
    set.add(m[1])
  }
  return Array.from(set)
}

export function evaluateDerivedExpression(
  expression: string,
  valuesMap: Record<string, any>,
  fields: FormField[]
) {
  const labelToId: Record<string, string> = {}
  for (const f of fields) {
    labelToId[f.label] = f.id
  }
  let normalizedExpression = expression.replace(
    /\{\{\s*([a-zA-Z0-9-_]+)\s*\}\}/g,
    (_, key) => {
      const realId = labelToId[key] || key
      return `{{${realId}}}`
    }
  )
  let replaced = normalizedExpression.replace(
    /\{\{\s*([a-zA-Z0-9-_]+)\s*\}\}/g,
    (_, id) => JSON.stringify(valuesMap[id])
  )

  const helpers = {
    parseDate: (s: string) => (s ? Date.parse(s) : NaN),
    now: () => Date.now(),
    ageFromDOB: (s: string) => {
      const dob = s ? new Date(s) : null
      if (!dob) return null
      const diff = Date.now() - dob.getTime()
      return Math.floor(diff / 31557600000)
    },
  }

  try {
    const func = new Function(
      'helpers',
      `with (helpers) { return (${replaced}); }`
    )
    return func(helpers)
  } catch (e) {
    console.error('Derived eval error', e)
    return null
  }
}

export function detectCycle(fields: FormField[]) {
  const adj: Record<string, string[]> = {}
  for (const f of fields) {
    adj[f.id] = []
  }
  for (const f of fields) {
    if (f.isDerived && f.parents) {
      for (const p of f.parents) {
        adj[f.id].push(p)
      }
    }
  }
  const visited: Record<string, number> = {}

  const hasCycle = (node: string): boolean => {
    if (visited[node] === 1) return true
    if (visited[node] === 2) return false
    visited[node] = 1
    for (const nb of adj[node] || []) {
      if (hasCycle(nb)) return true
    }
    visited[node] = 2
    return false
  }

  for (const k of Object.keys(adj)) {
    if (!visited[k]) {
      if (hasCycle(k)) return true
    }
  }
  return false
}
