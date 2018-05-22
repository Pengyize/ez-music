# 奕泽音乐

## Preview
- [播放页面（移动端）](pengyize.top/ez-music/src)
- [管理页面（PC）](pengyize.top/ez-music/src/admin)，通过本地服务器连接到七牛云服务器上传音乐

## Technique Stack
该项目包括 PC 端后台管理页面 以及 移动端播放页面，主要涉及到的技术有：
- HTML5：根据 HTML 最新标准使用具有语义化的标签
- CSS3：根据 CSS 语言最新版本为元素设置正确的样式
- jQuery：原生 JS 的封装库，更加便捷的操作 DOM 以及调用 JS API
- MVC：即 Model、View、Controller，一种软件设计模式，面向对象编程
- LeanCloud：提供一站式后端云服务，作为歌曲信息存储的后台云服务器
- 七牛云：国内领先的企业级云服务商，作为歌曲文件存储的后台云服务器
- 本地服务器：开启 Node.js 服务监听 1234 端口的请求，用来生成 uptoken ，在后台向七牛上传文件前进行初始化，给予权限

## Releases
### Version 1.0
- 完成 PC 端管理页面的部分样式制作
- 完成新建歌曲、编辑歌曲页面制作

## Solved issues
[我的简书博客](https://www.jianshu.com/p/cea1fa2b80e3）
