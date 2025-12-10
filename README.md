<h1 align="center">resume</h1>

一个通过markdown帮助自己写简历工具，可以打包网页或者生成PDF。

## 运行项目

使用node 16.0及以上的版本

### 安装依赖

```sh
pnpm install
```

### 编译重新加载开发

```sh
pnpm run dev
```

## 提交方法

由于使用了husky + commitlint对提交进行验证，需要使用如下几种方法提交

- 方法一：

```shell
pnpm run commit
```

- 方法二：提交时直接使用规范的格式

```shell
git commit -m "feat: 添加一个新特性"
```

## License

resume is [MIT](./LICENSE).
