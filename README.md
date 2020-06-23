### 介绍
根据 hire 项目提出的 foundation 写的 error-parser

#### 功能实现
功能用基本的循环判断实现，用 `regex` 来做对于 `错误信息` 的解析。

#### 单元测试
除了官方给出的测试案例，我在这基础上加了一些可能出现的测试情况。使用的工具是  `mocha` + `chai` 的组合

#### Linter 和 Formatter
用 `eslint` 做 lint 和 format，配置用的 `standard`。配合 `typescript-eslint` 插件来读取 typescript 文件。

#### Precommit
Precommit 使用的是 `hasky`，搭配 `lint-staged` 做 linter

#### CI
目前简单的用 GitHub actions 做了简单的 CI 测试 和 lint 检测