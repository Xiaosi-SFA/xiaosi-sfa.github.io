import { describe, it, expect } from 'vitest'
import { getI18n } from '../../src/utils/i18n'

describe('i18n 核心语言识别与路由解析', () => {
  it('应准确识别中文默认根路径与子路径', () => {
    const home = getI18n('/')
    expect(home.currentLocale).toBe('zh-cn')
    expect(home.isEn).toBe(false)
    expect(home.localePrefix).toBe('')
    expect(home.pathNoLocale).toBe('/')
    expect(home.isHomeNormalized).toBe(true)

    const activity = getI18n('/activity/')
    expect(activity.currentLocale).toBe('zh-cn')
    expect(activity.isEn).toBe(false)
    expect(activity.localePrefix).toBe('')
    expect(activity.pathNoLocale).toBe('/activity/')
    expect(activity.isHomeNormalized).toBe(false)
  })

  it('应准确识别英文路由并提取干净的相对路径与前缀', () => {
    const enHome = getI18n('/en/')
    expect(enHome.currentLocale).toBe('en')
    expect(enHome.isEn).toBe(true)
    expect(enHome.localePrefix).toBe('/en')
    expect(enHome.pathNoLocale).toBe('/')
    expect(enHome.isHomeNormalized).toBe(true)

    const enDetail = getI18n('/en/activity/other/three-body-20th-anniversary-salon/')
    expect(enDetail.currentLocale).toBe('en')
    expect(enDetail.isEn).toBe(true)
    expect(enDetail.localePrefix).toBe('/en')
    expect(enDetail.pathNoLocale).toBe('/activity/other/three-body-20th-anniversary-salon/')
  })

  it('应准确识别中文特定语言前缀 /zh-cn/', () => {
    const zhDetail = getI18n('/zh-cn/about/')
    expect(zhDetail.currentLocale).toBe('zh-cn')
    expect(zhDetail.isEn).toBe(false)
    expect(zhDetail.localePrefix).toBe('')
    expect(zhDetail.pathNoLocale).toBe('/about/')
  })

  it('翻译函数 t() 在英文环境下应输出英文，且支持平滑回退', () => {
    const enI18n = getI18n('/en/articles/')
    expect(enI18n.t('articles.title')).toBe('Articles')
    expect(enI18n.t('nav.home')).toBe('Home')
    expect(enI18n.t('non.existent.key', 'Fallback Text')).toBe('Fallback Text')
  })

  it('翻译函数 t() 在中文环境下应输出中文', () => {
    const zhI18n = getI18n('/articles/')
    expect(zhI18n.t('articles.title')).toBe('文章')
    expect(zhI18n.t('nav.home')).toBe('首页')
    expect(zhI18n.t('non.existent.key', '默认文本')).toBe('默认文本')
  })
})
