type NodeProps = Record<string, string> | null
type NodeChildren = Node[] | string | null
export interface Node {
  el?: HTMLElement
  tag: string
  props: NodeProps
  children: NodeChildren
}

/**
 *
 * @param tag html元素的标签
 * @param props 元素的属性
 * @param children 子元素
 * @returns 返回生成节点对象
 */
export function createNode(tag: string, props: NodeProps, children: NodeChildren): Node {
  return {
    tag,
    props,
    children,
  }
}

function propsToStr(props: NodeProps) {
  if (!props)
    return ''
  let str = ''
  for (const key in props) {
    str += `${key}="${props[key]}" `
  }
  return str
}

export function parseNodeToElString(node: Node): string {
  const { tag, children, props } = node
  if (children) {
    if (typeof children === 'string') {
      return `<${tag} ${propsToStr(props)}>${children}</${tag}>`
    }
    if (Array.isArray(children) && children.length > 0) {
      return `<${tag} ${propsToStr(props)}>${children.map(child => parseNodeToElString(child)).join('')}</${tag}>`
    }
  }
  return `<${tag} ${propsToStr(props)}/>`
}

/**
 * 解析自定义的语法, 正确的语法输出正确的element节点
 * @param text  待解析的文本
 * @returns
 */
export function parseResumeSyntax(text: string): string {
  const texts = text.trim().split(/\s+/)

  if (texts && texts.length) {
    const lastIndex = texts.length - 1
    if (lastIndex !== 1 && texts[texts.length - 1] === '???') {
      // section
      if (texts[0] === '???section') {
        const sectionNode = createNode('section', { class: 'resume-section' }, [
          createNode('div', { class: 'sec-title' }, texts[1]),
        ])
        return parseNodeToElString(sectionNode)
      }

      if (texts[0] === '???item') {
        const itemNode = createNode('div', { class: 'resume-item' }, [
          createNode('div', { class: 'item-left' }, texts[1]),
          createNode('div', { class: 'item-left' }, texts[2]),
        ])
        return parseNodeToElString(itemNode)
      }
    }
  }
  return text
}
/**
 * 自定义语法解析成为真正渲染的markdown文件
 */
export function parseCustomSyntaxToMd(text: string) {
  const newText = text.replace(/^(\?\?\?([\s\S]*?)\?\?\?)$/gm, (match) => {
    const key = match.split(/\s+/)[0].replace('???', '')
    if (key === 'section' || key === 'item') {
      const parseStr = parseResumeSyntax(match)
      return parseStr
    }
    return match
  })
  return newText
}
