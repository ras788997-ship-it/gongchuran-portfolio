# 龚楚然 · 求职作品集（静态站）

一个纯静态的中文求职作品集，包含首页、项目总览、三个项目详情页和结尾联系页。无框架、无构建步骤、无外部 CDN 依赖，直接上传即可托管。

## 页面

| 文件 | 内容 |
|---|---|
| `index.html` | 首页：Hero、关于我（教育 / 意向岗位）、我的项目 |
| `work-1.html` | 制造业质量部 AI 助手 |
| `work-2.html` | 六西格玛 AI 助手微信小程序 |
| `work-3.html` | AI 美甲虚拟试戴网站 |
| `index.html#contact` | 结尾页段落：联系方式 / 下载简历（并入首页，向下滚动可见） |
| `404.html` | 404 |
| `contact.html` | 旧链接兼容页，自动跳到 `index.html#contact` |

## 技术说明

- 纯 HTML + CSS + 原生 JS，无 npm 依赖、无构建产物。
- 字体：`assets/fonts/jingnan.woff2`（荆南圆体，正文 / 项目名）与 `quancang.woff2`（犬仓旧明朝，品牌 / 摘要 / 按钮），均已子集化，仅包含本站用到的字符。
- 图片：项目截图全部来自真实运行记录，`assets/img/` 内同时提供 `.webp` 与 `.jpg`，通过 `<picture>` 优先加载 WebP。
- 简历：`assets/docs/resume-test.pdf` 与 `resume-delivery.pdf`，由结尾页下载。
- 无统计脚本、无第三方字体、无外部图片请求；`robots.txt` / `sitemap.xml` 已按 GitHub Pages 地址配置。

## 本地预览

```powershell
python -m http.server 8899 --directory .
# 浏览器打开 http://127.0.0.1:8899/
```

## 部署

当前托管在 GitHub Pages：`https://ras788997-ship-it.github.io/gongchuran-portfolio/`。
仓库根目录即站点根目录，推送到 `main` 后 GitHub Pages 自动发布。

## 内容边界

项目数据来自真实记录；未上线、未收费、无真实用户的项目已在详情页注明边界，不把原型写成已运营产品。
