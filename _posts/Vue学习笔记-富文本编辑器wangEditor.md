最近开发Vue项目，想要一个功能更全面的编辑器，我找了好久，目前常见的编辑器有这些：

**UEditor**：百度前端的开源项目，功能强大，基于 jQuery，但已经没有再维护，而且限定了后端代码，修改起来比较费劲，并且比较重。

**bootstrap-wysiwyg**：微型，易用，小而美，只是 Bootstrap + jQuery...

**kindEditor：**功能强大，代码简洁，需要配置后台，而且好久没见更新了。

**quill**：本身功能不多，不过可以自行扩展，api 也很好懂，如果能看懂英文的话...

**summernote**：没深入研究，UI挺漂亮，也是一款小而美的编辑器，就是用的人不多。

 **tinymce：**GitHub 上星星很多，功能也齐全；唯一一个从 word 粘贴过来还能保持绝大部分格式的编辑器； 不需要找后端人员扫码改接口，前后端分离；但是，在项目里配置麻烦一点。

**wangEditor**：轻量、简洁、易用，但是升级到 3.x 之后，不便于定制化开发。不过作者很勤奋，广义上和我是一家人，打个call。

于是就选择则WangEditor2。

1. 安装：

   ```js
   点击 https://github.com/wangfupeng1988/wangEditor/releases 下载最新版
   使用git下载： git clone https://github.com/wangfupeng1988/wangEditor.git
   使用npm安装: npm install wangeditor （注意 wangeditor 全部是小写字母）
   使用bower下载：bower install wangEditor （前提保证电脑已安装了bower）
   ```

   在项目中直接 **npm install wangeditor --save**，如果安装了淘宝镜像，就使用 **cnpm install wangeditor --save**，会快一点。

2. 在页面中放入

   ```html
   <div id="editor"></div>
   ```

   然后

   ```js
   import WangEditor from 'wangeditor'
   ```

   ```js
   let that = this
   this.editor = new WangEditor('#WangEditor')  //这个地方传入div元素的id 需要加#号
   // 配置 onchange 事件
   this.editor.change = function () {          // 这里是change 不是官方文档中的 onchange
     // 编辑区域内容变化时，实时打印出当前内容
     console.log(this.txt.html())
   }
   this.editor.create()     // 生成编辑器
   this.editor.txt.html('<p>输入内容...</p>')   //注意：这个地方是txt  不是官方文档中的$txt
   ```

3. 在开发中碰到过这么个问题，就是在用v-if动态显示隐藏页面元素时，页面会进行重绘，目标元素div依然存在于dom树中，但是wanEditor实例需要重新生成，且需要在this.$nextTick方法中调用

   ```js
   this.editor = new WangEditor('#WangEditor')
   ```

   方可生效

4. wangEditor的输入控制栏与输入区域默认的z-index为100001 10000，当富文本编辑框上方有下拉菜单时，选择框会被覆盖。解决办法

   ```css
   .w-e-menu{
     z-index: 2 !important;
   }
     .w-e-text-container{
       z-index: 1 !important;
     }
   ```

   注：w-e-menu的z-index必须比container的大，不然选择菜单栏选项时，会选不上

   代码示例：

   ```vue
   <script type="text/javascript">
   import WangEditor from 'wangeditor';
   export default {
       data(){
           return{
               dataInterface: {
                   editorUpImgUrl: 'http://xxxx'  // 编辑器插入的图片上传地址
               },
               editor: '',  // 存放实例化的wangEditor对象，在多个方法中使用
           }
       },
       ready(){
           this.createEditor();
       },
       beforeDestroy(){
           this.destroyEditor();
       },
       methods: {
           createEditor(){  // 创建编辑器
               this.editor = new WangEditor('account--editor');
               this.initEditorConfig();  // 初始化编辑器配置，在create之前
               this.editor.create();  // 生成编辑器
               this.editor.$txt.html('<p>要初始化的内容</p>');  // 初始化内容
               $('#account--editor').css('height', 'auto');  // 使编辑器内容区自动撑开，在css中定义min-height
           },
           destroyEditor(){  // 销毁编辑器，官方没有给出完美方案。此方案是作者给出的临时方案
               this.editor.destroy();  // 这个没有完全销毁实例，只是作了隐藏
               // $('#account--editor').remove();  // 不报错的话，这一步可以省略
               this.editor = null;
               WangEditor.numberOfLocation--;  // 手动清除地图的重复引用，作者的临时解决方案。否则单页面来回切换时，地图报错重复引用
           },
           initEditorConfig(){  // 初始化编辑器配置
               this.editor.config.fontsizes = {  // 字号配置，增加14px
                   // 格式：'value': 'title'
                   1: '12px',
                   2: '13px',
                   3: '14px',
                   4: '16px',
                   5: '18px',
                   6: '24px',
                   7: '32px',
                   8: '48px'
               };
               this.editor.config.uploadImgUrl = this.dataInterface.editorUpImgUrl;  // 图片上传地址
   
               this.editor.config.uploadImgFileName = '_img';  // 统一指定上传的文件name，需要指定。否则默认不同的上传方式是不同的name
   
               const usersecret = window.localStorage.getItem('usersecret');  // 获取 usersecret
   
               this.editor.config.uploadParams = {  // 自定义上传参数配置
                   usersecret: usersecret
               };
   
           },
           getEditorContent(){  // 获取编辑器 内容区内容
               this.editorContent = this.editor.$txt.html();  // 获取 html 格式
               // this.editor.$txt.text();  // 获取纯文本
               // this.editor.$txt.formatText();  // 获取格式化后的纯文本
   
           },
       }
   }
   
   </script>
   ```
