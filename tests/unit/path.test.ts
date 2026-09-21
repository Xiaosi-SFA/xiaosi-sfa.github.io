import { describe, it, expect } from 'vitest'
import { withBase } from '../../src/utils/path'

describe('路径工具 (Path Utils)', () => {
  it('应正确处理以斜杠开头的路径', () => {
    const p = withBase('/activity/')
    expect(p).toMatch(/\/activity\/$/)
  })

  it('应保留带语言前缀的深层路径', () => {
    const p = withBase('/en/activity/other/three-body-20th-anniversary-salon/')
    expect(p).toMatch(/\/en\/activity\/other\/three-body-20th-anniversary-salon\/$/)
  })

  it('应避免生成多余的双斜杠', () => {
    const p = withBase('//about/')
    expect(p).not.toContain('///')
  })
})
