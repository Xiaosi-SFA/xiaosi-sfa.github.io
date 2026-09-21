import { describe, it, expect } from 'vitest'
import { normalizeAuthors, formatAuthorsString } from '../../src/utils/author'

describe('作者规范与元数据解析 (Author Normalization)', () => {
  it('应能正确解析包含角色的学术作者对象数组', () => {
    const raw = [
      { name: '柏夜', role: '排版' },
      { name: '云梦泽', role: '文稿', corresponding: true },
      { name: 'gemini', role: '翻译' },
    ]
    const list = normalizeAuthors(undefined, raw)
    expect(list).toHaveLength(3)
    expect(list[0]).toEqual({
      name: '柏夜',
      role: '排版',
      corresponding: false,
      equalContribution: false,
      email: undefined,
      affiliation: undefined,
    })
    expect(list[1].corresponding).toBe(true)
    expect(list[2].role).toBe('翻译')
  })

  it('应能兼容逗号分隔的普通字符串作者', () => {
    const list = normalizeAuthors('夏虫, 云梦泽')
    expect(list).toHaveLength(2)
    expect(list[0].name).toBe('夏虫')
    expect(list[1].name).toBe('云梦泽')
  })

  it('formatAuthorsString 应能格式化作者字符串', () => {
    const str = formatAuthorsString(undefined, [{ name: '夏虫' }, { name: 'gemini' }])
    expect(str).toBe('夏虫, gemini')
  })
})
