import yaml from 'js-yaml'

type NodeProps = Record<string, string> | null
type NodeChildren = Node[] | string | number | null | undefined
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
    str += `${key}="${props[key]}"`
  }
  return str
}

export function parseNodeToElString(node: Node): string {
  const { tag, children, props } = node
  if (children) {
    if (typeof children === 'string' || typeof children === 'number') {
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
    if (lastIndex !== 1 && texts[texts.length - 1] === ':::') {
      // section
      if (texts[0] === ':::section') {
        const sectionNode = createNode('section', { class: 'resume-section' }, [
          createNode('div', { class: 'sec-title' }, texts[1]),
        ])
        return parseNodeToElString(sectionNode)
      }

      if (texts[0] === ':::item') {
        const itemNode = createNode('div', { class: 'resume-item' }, [
          createNode('div', { class: 'item-left' }, texts[1]),
          createNode('div', { class: 'item-right' }, texts[2]),
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
  const newText = text.replace(/^(:::([\s\S]*?):::)$/gm, (match) => {
    const key = match.split(/\s+/)[0].replace(':::', '')
    if (key === 'section' || key === 'item') {
      const parseStr = parseResumeSyntax(match)
      return parseStr
    }
    return match
  })
  return newText
}

/**
 * 解析同yml得到配置生成html
 */
export interface ResumeBasicInfo {
  title?: string
  icon?: string
  content: string
  link?: string
}

export interface ResumeMainInfo {
  title: string
  job: string
  /**
   * 个人信息布局位置
   * @default 'top' 个人信息默认在顶部
   */
  infoLayout?: 'left' | 'top' | 'right'
  avatar?: string
  basicInfos: ResumeBasicInfo[]
}

export function parseMainInfoToHtml(info: ResumeMainInfo) {
  const imgNode = info.avatar ? createNode('img', { class: 'avatar', src: info.avatar }, null) : null

  const basicItemNodes = info.basicInfos.map((item) => {
    const itemWrapperInnerNode = [
      createNode('span', { class: 'item-title' }, item.icon
        ? `<i class="${item.icon}"></i>`
        : item.title),
      createNode('span', { class: 'item-content' }, item.content),
    ]

    const itemWrapperNode = item.link
      ? createNode('a', { class: 'item-wrapper', href: item.link }, itemWrapperInnerNode)
      : createNode('span', { class: 'item-wrapper' }, itemWrapperInnerNode)

    return createNode('div', { class: 'basic-item' }, [
      itemWrapperNode,
    ])
  })

  // 添加个人资料标签
  if (info.infoLayout === 'left' || info.infoLayout === 'right') {
    const infoTitleNode = createNode('div', { class: 'basic-info-title' }, '个人资料')
    basicItemNodes.unshift(infoTitleNode)
  }
  const layoutBgName = info.avatar ? '' : 'layout-bg'
  const jobInfoNode = createNode('div', { class: 'job-info' }, [
    createNode('div', { class: layoutBgName }, [
      createNode('div', { class: 'name' }, info.title),
      createNode('div', { class: 'job' }, info.job),
    ]),
  ])
  if (imgNode && Array.isArray(jobInfoNode.children)) {
    jobInfoNode.children!.unshift(imgNode)
  }

  const profileNode = createNode('div', { class: 'profile' }, [
    jobInfoNode,
    createNode('div', { class: 'basic-info' }, basicItemNodes),
  ])

  const html = parseNodeToElString(profileNode)

  return `${html}\n\n`
}

/**
 * 解析markdown的yml to Object
 */
export function parseYmlToObject(md: string): Record<string, any> | null {
  const match = md.match(/^---\n([\s\S]*?)\n---/)
  if (match) {
    const yamlContent = match[1]
    const data = yaml.load(yamlContent) as Record<string, any>
    return data
  }
  return null
}
