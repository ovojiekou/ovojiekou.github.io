# ovojiekou · 个人档案

线上地址：<https://ovojiekou.github.io/>

一个不依赖任何框架、不请求任何第三方资源的单页个人主页。
纯 HTML + CSS + 一点点原生 JavaScript，直接放到 GitHub Pages 就能用。

视觉上按「小型线上个展」来做：石墨黑、骨白、极细分割线、衬线大字，
头像做成一张裱在纸上的墨线肖像。

```
index.html               页面结构与文案
assets/css/main.css      样式、配色、栅格
assets/js/main.js        主题切换 / 滚动进场 / 一键复制
assets/img/portrait.jpg  头像
assets/audio/*.m4a       最近在听的 30 秒试听片段
```

## 本地预览

直接双击 `index.html` 就行。
想更接近线上环境：

```bash
python -m http.server 8080
```

打开 <http://localhost:8080>。

## 改内容

文案全部在 `index.html` 里，按区块顺序改：

| 想改什么 | 位置 |
| --- | --- |
| 浏览器标题 / 分享描述 | `<head>` 里的 `<title>` 与 `<meta name="description">` |
| 名字 | `.hero-copy` 里的 `<h1 class="name">` |
| 城市 · 专业 · 年级 | 紧跟其后的 `.role` |
| 自我介绍 | `.lede` |
| 三条小信息 | `.meta` 里的 `<dt>` / `<dd>` |
| 「现在」四件事 | `#now` 里 `.rows` 的 `<li>` |
| 四个数字 | `#now` 里 `.figure-row` |
| 「关于」三张卡 | `#about` 里 `.fact` |
| 时间线 | `#road` 里 `<li>` |
| 最近在听 | `#likes` 里 `.track-btn` 的文案、`data-src` 和 `data-link` |
| 联系方式 | `#contact` 里 `.big-mail` 和 `.contact-list` |

换头像：把新图片命名为 `portrait.jpg` 放进 `assets/img/` 覆盖即可（正方形效果最好）。

改配色只动 `main.css` 最上面的变量：

```css
:root {
  --bg:    #0f0f11;                 /* 背景 */
  --text:  #f2f0ec;                 /* 正文 */
  --dim:   #adaaa3;                 /* 次要文字 */
  --line:  rgba(242, 240, 236, .12);/* 分割线 */
  --brass: #b99b73;                 /* 唯一的一点金属色 */
}
```

默认是暖纸白（`data-theme="light"`），深色是第二套主题；
两套配色分别写在 `:root` 和 `[data-theme="light"]` 里，点右上角按钮切换。

## 更新线上页面

仓库已经发布在 <https://github.com/ovojiekou/ovojiekou.github.io>，
线上地址是 <https://ovojiekou.github.io/>。

改完 `index.html` 或 `assets/` 后，在本目录执行：

```bash
git add .
git commit -m "update homepage"
git push
```

GitHub Pages 会自动重新构建，通常 1–2 分钟后生效。
首次推送如果提示登录，按 Git Credential Manager 的提示登录 GitHub 即可。

## 细节

- 零外部字体、零 CDN，断网也能正常显示。
- 深色 / 浅色两套主题，选择记在本地。
- 滚动进场动画会尊重系统的「减少动态效果」设置。
- 联系方式一键复制；打印时自动隐藏导航与装饰。
- 最近在听使用 30 秒官方试听片段，点击曲目即可播放/暂停；完整版链接到 Apple Music。
- 小猫线稿、爪印和猫头 favicon 作为页面的小彩蛋。
