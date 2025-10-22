import type { Node, ResumeMainInfo } from '.'
import { describe, expect, it } from 'vitest'
import { createNode, parseCustomSyntaxToMd, parseMainInfoToHtml, parseNodeToElString, parseResumeSyntax } from '.'

// todo: 后面优化测试用例
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
    // todo: 通过我定义的方法多一个空格需要优化
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
      const text = ':::section 职业技能 :::'
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
      const text = `:::section
       职业技能
       :::`
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
      const text = `:::section
       职业技能
       职业技能2
       :::
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

    it('parseResume item', () => {
      const text = `:::item 杭州阅读科技有限公司  2023/02-至今 :::`
      expect(parseResumeSyntax(text)).toMatchInlineSnapshot(`"<div class="resume-item" ><div class="item-left" >杭州阅读科技有限公司</div><div class="item-right" >2023/02-至今</div></div>"`)
    })
  })
  describe('parseCustomSyntaxToMd', () => {
    const md = `
    # Resume

    :::section
    职业技能
    :::

    :::item 杭州阅读科技有限公司 2023/02-至今 :::
    *前端组长*
    `
    it('返回正确的结果', () => {
      // todo: 修复有换行符的bug
      expect(parseCustomSyntaxToMd(md)).toMatchInlineSnapshot(`
        "
            # Resume

            :::section
            职业技能
            :::

            :::item 杭州阅读科技有限公司 2023/02-至今 :::
            *前端组长*
            "
      `)
    })
  })

  describe('parseMainInfoToHtml', () => {
    it('应该返回正确的html', () => {
      const mainInfo: ResumeMainInfo = {
        name: '张三',
        job: '前端',
        avatar: 'https://avatars.githubusercontent.com/u/102160226?v=4',
        basicInfos: [
          {
            title: '个人网站',
            content: 'https://www.zhangsan.com',
          },
          {
            title: 'Github',
            icon: 'github',
            content: 'https://github.com/zhangsan',
          },
        ],
      }

      const result = parseMainInfoToHtml(mainInfo)
      expect(result).toMatchInlineSnapshot(`
        "
           <div class="profile">
              <div class="job-info">
                <img src="https://avatars.githubusercontent.com/u/102160226?v=4" />
                <div>
                  <div class="name">
                    张三
                  </div>
                  <div class="job">
                    前端
                  </div>
                </div>
              </div>
              <div class="basic-info">

            <div class="basic-item">
              <span class="item-wrapper">
              <text class="item-title">个人网站</text><text class="item-content">https://www.zhangsan.com</text>
            </span>
            </div>

            <div class="basic-item">
              <span class="item-wrapper">
              <i class="i-carbar-github"></i><text class="item-content">https://github.com/zhangsan</text>
            </span>
            </div>

              </div>
            </div>
          "
      `)
    })
  })
})
