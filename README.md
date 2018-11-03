参照angular 和 react 的结构配置vue，以适应大型项目

assets 
-- 存放公共的 图片 字体 样式等资源

components
-- 存放公共的组件

modules
-- 每个功能点全部写成module
---- _components
------ 存放该模块的组件(一般组件尽量写成无副作用组件，只接受容器组件的数据)
---- _service
------ 存放api, 只定义获取数据的过程
---- _store
------ actions.js 存放该module的逻辑处理
------ getters 
------ index.js
------ mutations.js

router
-- 路由文件 守卫 等

store
-- 聚合所有状态的store

filters
-- 全局过滤器

directives
-- 全局指令目录

utils
-- 存放工具函数， 如dom相关 和 计算相关 等等

views
-- 每个页面的html，通过modules组装


尽量不要写index

