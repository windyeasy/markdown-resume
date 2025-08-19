import type { Node } from '.'
import { describe, expect, it } from 'vitest'
import { createNode, parseNodeToElString, parseResumeSyntax } from '.'

// 一行行的匹配，使用python里面的方式，效率慢一点就慢一点
describe('logics', () => {
  describe('createNode', () => {
    it('should create node', () => {
      const node = createNode('div', { class: 'test' }, [createNode('span', {}, 'test')])
      expect(node).toEqual({
        tag: 'div',
        props: {
          class: 'test',
        },
        children: [
          {
            tag: 'span',
            props: {},
            children: 'test',
          },
        ],
      })
    })
  })
  describe('parseNodeToElString', () => {
    it('should parse node to string', () => {
      const node: Node = {
        tag: 'section',
        props: {
          class: 'resume-section',
        },
        children: [
          {
            tag: 'div',
            props: {
              class: 'sec-title',
            },
            children: '职业技能',
          },
        ],
      }
      const result = parseNodeToElString(node)
      expect(result).toMatchInlineSnapshot(`"<section class="resume-section" ><div class="sec-title" >职业技能</div></section>"`)
    })
  })

  describe('parseResumeSyntax', () => {
    it('单行返回正确的section el string', () => {
      const text = '???section 职业技能 ???'
      const result = parseNodeToElString(createNode('section', {
        class: 'resume-section',
      }, [
        createNode('div', {
          class: 'sec-title',
        }, '职业技能'),
      ]))
      expect(parseResumeSyntax(text)).toBe(result)
    })
    it('多行返回正确的section el string', () => {
      const text = `???section
       职业技能
       ???`
      const result = parseNodeToElString(createNode('section', {
        class: 'resume-section',
      }, [
        createNode('div', {
          class: 'sec-title',
        }, '职业技能'),
      ]))
      expect(parseResumeSyntax(text)).toBe(result)
    })
    it('多个换行文本返回忽略多出内容的section el string', () => {
      const text = `???section
       职业技能
       职业技能2
       ???
      `
      const result = parseNodeToElString(createNode('section', {
        class: 'resume-section',
      }, [
        createNode('div', {
          class: 'sec-title',
        }, '职业技能'),
      ]))
      expect(parseResumeSyntax(text)).toBe(result)
    })

    it('解析错误的字符串', () => {
      const text = '??section'
      expect(parseResumeSyntax(text)).toBe('??section')
    })
  })
})
