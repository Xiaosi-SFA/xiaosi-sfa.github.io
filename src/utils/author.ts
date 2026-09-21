export interface AuthorItem {
  name: string
  role?: string
  corresponding?: boolean
  equalContribution?: boolean
  email?: string
  affiliation?: string
}

/**
 * Normalizes author data from various frontmatter shapes into a standard AuthorItem array.
 * Supports:
 * - string: "作者名" or "@作者名,协同作者"
 * - string[]: ["作者A", "作者B"]
 * - AuthorItem[]: [{ name: "作者A", equalContribution: true }, { name: "作者B", corresponding: true }]
 */
export function normalizeAuthors(author?: any, authors?: any): AuthorItem[] {
  const raw = authors ?? author
  if (!raw) return []

  if (Array.isArray(raw)) {
    return raw.map((item) => {
      if (typeof item === 'string') {
        return { name: item.trim() }
      }
      if (item && typeof item === 'object' && item.name) {
        return {
          name: String(item.name).trim(),
          role: item.role ? String(item.role).trim() : undefined,
          corresponding: Boolean(item.corresponding),
          equalContribution: Boolean(item.equalContribution),
          email: item.email ? String(item.email).trim() : undefined,
          affiliation: item.affiliation ? String(item.affiliation).trim() : undefined,
        }
      }
      return { name: String(item) }
    })
  }

  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (!trimmed) return []
    // If it's comma-separated without spaces around special chars, split by comma if multiple
    if (trimmed.includes(',') && !trimmed.startsWith('@')) {
      return trimmed.split(',').map((n) => ({ name: n.trim() })).filter((n) => n.name)
    }
    return [{ name: trimmed }]
  }

  if (typeof raw === 'object' && raw.name) {
    return [{
      name: String(raw.name).trim(),
      role: raw.role ? String(raw.role).trim() : undefined,
      corresponding: Boolean(raw.corresponding),
      equalContribution: Boolean(raw.equalContribution),
      email: raw.email ? String(raw.email).trim() : undefined,
      affiliation: raw.affiliation ? String(raw.affiliation).trim() : undefined,
    }]
  }

  return []
}

/**
 * Formats authors into a simple plain-text string for compact cards or list views.
 */
export function formatAuthorsString(author?: any, authors?: any): string {
  const list = normalizeAuthors(author, authors)
  if (!list.length) return ''
  return list.map((a) => a.name).join(', ')
}
