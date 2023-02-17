PageSetup 对象包含所有页面设置的属性（左边距、底部边距、纸张大小等）。

此对象共有 49 个属性，其中：8 个属性是 EXCEL2007 新添加的，1 个属性在 2007 中被删除了。

###一、与“页面”选项卡对应的属性有 7 个。

分别为：`PrintQuality、Orientation、FirstPageNumber、Zoom、FitToPagesWide、FitToPagesTall、PaperSize`。

1、PrintQuality：返回或设置打印质量。Variant 类型，可读写。此属性与“打印质量”选项对应。
```
Worksheets("Sheet1").PageSetup.PrintQuality = Array(240, 140)’ 用数组指定水平和垂直方向的打印质量
Worksheets("Sheet1").PageSetup.PrintQuality(1)=600’ 指定水平方向的打印质量
Worksheets("Sheet1").PageSetup.PrintQuality(2)=600’ 指定垂直方向的打印质量
```
以上示例在使用过程中是否出现错误取决于使用的打印机驱动程序，因为不同打印机能够设置的质量是不同的。

2、Orientation：返回或设置一个 XlPageOrientation 值，它代表纵向或横向打印模式。此属性与“方向”选项对应。
```
Worksheets("Sheet1").PageSetup.Orientation = xlLandscape’ 设置模向打印模式
Worksheets("Sheet1").PageSetup.Orientation = xlPortrait’ 设置纵向打印模式
```
3、FirstPageNumber：返回或设置打印指定工作表时第一页的页号。

>如果设为xlAutomatic，则 MicrosoftExcel 采用第一页的页号。默认值为 xlAutomatic。Long
类型，可读写。此属性与“起始页码”选项对应。

可以根据需要设置任意的数据，这样打印出来的报表就不是从第一页开始了的。

4、Zoom：返回或设置一个 Variant 值，它代表一个数值在 10%到 400%之间的百
分比，该百分比为 MicrosoftExcel 打印工作表时的缩放比例。此属性与“缩放比
例”选项对应。

>输入时不要输入百分号（%），只输入数值就可以了。

5、FitToPagesWide：返回或设置打印工作表时，对工作表进行缩放使用的页宽。
仅应用于工作表。

>Variant 类型，可读写。此属性与“页高”选项对应。

6、FitToPagesTall：返回或设置打印工作表时，对工作表进行缩放使用的页高。

>仅应用于工作表。Variant 类型，可读写。此属性与“页宽”选项对应。

只有 Zoom属性值为 False 时，FitToPagesWide 和 FitToPagesTall属性才会起作用，
大家使用的时候请注意。

7、PaperSize：返回或设置纸张的大小。

>XlPaperSize 类型，可读写。此属性与“纸张大小”选项对应。

###二、与“页边距”选项卡对应的属性有 8 个。

分别为：`CenterVertically、CenterHorizontally、TopMargin、BottomMargin、FooterMargin、HeaderMargin、RightMargin、LeftMargin`

1、CenterVertically：如果在页面的垂直居中位置打印指定工作表，则该属性值为
True。Boolean 类型，可读写。此属性与“垂直”选项对应。
```
Worksheets("Sheet1").PageSetup. CenterVertically = True’将工作表设置成垂直居
中。
```
2、CenterHorizontally：如果在页面的水平居中位置打印指定工作表，则该属性
值为 True。Boolean 类型，可读写。此属性与“水平”选项对应。
```
Worksheets("Sheet1").PageSetup.CenterHorizontally = True’将工作表设置成水平
居中。
```
3、TopMargin：以磅为单位返回或设置上边距的大小。Double 类型，可读写。此属性与“上”选项对应。

4、BottomMargin：以磅为单位返回或设置底端边距的大小。Double 类型，可读写。此属性与“下”选项对应。

5、FooterMargin：以磅为单位返回或设置页脚到页面底端的距离。Double 类型，可读写。此属性与“页脚”选项对应。

6、HeaderMargin：以磅为单位返回或设置页面顶端到页眉的距离。Double 类型，可读写。此属性与“页眉”选项对应。

7、RightMargin：以磅为单位返回或设置右边距的大小。Double 类型，可读写。此属性与“右”选项对应。

8、LeftMargin：以磅为单位返回或设置左边距的大小。Double 类型，可读写。此属性与“左”选项对应。

我通过“页面设置”窗体将页面上边距设置成 2，请注意这里的单位是“厘米”（也就是说在“页边距”选项卡中数据的单位是“厘米”），使用录制宏会生成如下的代码：
```
.TopMargin = Application.InchesToPoints(0.78740157480315)
```
这段代码并不是我们一般思维的代码写法，为什么不是.TopMargin =2 呢？。

原因就是这 6 个属性的单位都“磅”，那么“磅“又是什么单位呢？磅：指打印的字符的高度的度量单位。1 磅等于 1/72 英寸（即 1 皮卡），或大约等于 1 厘米的 1/28。

那么这个“0.78740157480315”又是什么单位呢？答案是：“英寸”。

因此需要进行单位转换，InchesToPoints 方法的作用就是将度量单位从英寸转换为磅。

显然这种写法不符合我们国人的习惯，将“厘米”转换成“英寸”，再转换成“磅”，直接将“厘米”转换成“磅”不是更方便！

我们可以使用 CentimetersToPoints 方法 就 可 以 实 现 “ 厘 米 ” 直 接 转 “ 磅 ”。 

代 码 写 成 ：
```
 .TopMarginApplication.CentimetersToPoints(2)。
```


###三 、 与 “ 页 眉 / 页 脚 ” 选 项 卡 对 应 的 属 性 有 16 个 。 

分 别 为 ：`OddAndEvenPagesHeaderFooter 、 DifferentFirstPageHeaderFooter 、
ScaleWithDocHeaderFooter 、 AlignMarginsHeaderFooter 、 RightFooter 、RightFooterPicture 、 CenterFooter 、 CenterFooterPicture 、 LeftFooter 、LeftFooterPicture 、 RightHeader 、 RightHeaderPicture 、 CenterHeader 、CenterHeaderPicture、LeftHeader、LeftHeaderPicture`


1、OddAndEvenPagesHeaderFooter：如果指定的 PageSetup 对象的奇数页和偶数页具有不同的页眉和页脚，则为 True。可读/写 Boolean 类型。此属性与“奇偶页不同”选项对应。

2、DifferentFirstPageHeaderFooter：如果在第一页使用不同的页眉或页脚，则为True。可读/写 Boolean 类型。此属性与“首页不同”选项对应。

如果属性为 TRUE，则无法选择系统设置的页眉/页脚样式。需要使用 FirstPage属性设置第一页的页眉/页脚。

3、ScaleWithDocHeaderFooter：返回或设置页眉和页脚是否在文档大小更改时随文档缩放。可读/写 Boolean 类型。此属性与“随文档自动缩放”选项对应。

4、AlignMarginsHeaderFooter：如果 Excel 以页面设置选项中设置的边距对齐页眉和页脚，则返回 True。可读/写 Boolean 类型。此属性与“与页边距对齐”选项对
应。

5、RightFooter：右对齐 PageSetup 对象中的页脚信息。可读/写 String 类型。可读/写 String 类型。此属性与“自定义页脚-右”选项对应。

6、RightFooterPicture：返回一个 Graphic 对象，该对象代表页脚右边的图片，用于设置图片的属性。此属性与“自定义页脚-右”选项对应。

7、CenterFooter：居中对齐 PageSetup 对象中的页脚信息。可读/写 String 类型。此属性与“自定义页脚-中”选项对应。

8、CenterFooterPicture：返回一个 Graphic 对象，该对象表示页脚中间部分的图片。用于设置图片的属性。此属性与“自定义页脚-右”选项对应。

9、LeftFooter：左对齐 PageSetup 对象中的页脚信息。可读/写 String 类型。此属性与“自定义页脚-左”选项对应。

10、LeftFooterPicture：返回一个 Graphic 对象，该对象表示页脚左边的图片。用于设置图片的属性。此属性与“自定义页脚-左”选项对应。

11、RightHeader：右对齐 PageSetup 对象中的页眉信息。可读/写 String 类型。此属性与“自定义页眉-右”选项对应。

12、RightHeaderPicture：返回一个 Graphic 对象，该对象表示页眉右边的图片。用于设置图片的属性。。此属性与“自定义页眉-右”选项对应。

13、CenterHeader：居中对齐 PageSetup 对象中的页眉信息。可读/写 String 类型。此属性与“自定义页眉-中”选项对应。

14、CenterHeaderPicture：返回一个 Graphic 对象，该对象表示页眉中间部分的图片。用于设置图片的属性。此属性与“自定义页眉-中”选项对应。

15、LeftHeader：左对齐 PageSetup 对象中的页眉信息。可读/写 String 类型。此属性与“自定义页眉-左”选项对应。

16、LeftHeaderPicture：返回一个 Graphic 对象，该对象表示页眉左边的图片。用于设置图片的属性。此属性与“自定义页眉-左”选项对应。

以上对属性的说明与 EXCEL 的帮助不完全相同，因为经过测试帮助中的一些说明是有错误。

###四、 与“工作表”选项卡对应的属性有 11 个。

分别为：`Draft、PrintErrors、BlackAndWhite、PrintHeadings、PrintComments、PrintNotes、PrintArea、Order、PrintGridlines、PrintTitleRows、PrintTitleColumns`。

1、Draft：如果打印工作表时不打印其中的图形，则该属性值为 True。Boolean类型，可读写。此属性与“打印-草稿品质”选项对应。

将该属性设置为 True 可加快打印速度（但是不打印其中的图形）。

2、PrintErrors：设置或返回一个 XlPrintErrors 常量，该常量指定显示的打印错误类型。该功能允许用户在打印工作表时取消错误显示。可读写。此属性与“打印-错误单元格打印为”选项对应。
```
名称 值 描述 选项设置值
xlPrintErrorsBlank 1 打印错误为空白。 <空白>
xlPrintErrorsDash 2 打印错误显示为划线。 --
xlPrintErrorsDisplayed 0 显示全部打印错误。 显示值
xlPrintErrorsNA 3 打印错误显示为不可用。 #N/A
```
3、BlackAndWhite：如果指定文档中的元素以黑白方式打印，则该属性值为 True。Boolean 类型，可读写。此属性与“打印-单色打印”选项对应。

执行代码：
```
Worksheets("Sheet1").PageSetup.BlackAndWhite = True，Sheet1 工作表将以黑白方式打印。
```

4、PrintHeadings：如果打印本页时同时打印行标题和列标题，则该值为 True。仅应用于工作表。Boolean 类型，可读写。此属性与“打印-行号列标”选项对应。

5、PrintComments：返回或设置批注随工作表打印的方式。XlPrintLocation 类型，可读写。此属性与“打印-批注”选项对应。
```
名称 值 描述 选项设置值
xlPrintInPlace 16 批注打印在其插入工作表的位置。 如同工作表中的显示
xlPrintNoComments -4142 不打印批注。（默认） （空）
xlPrintSheetEnd 1 批注打印为工作表末尾的尾注。 工作表末尾
```
6、PrintNotes：如果打印工作表时单元格批注作为尾注一起打印，则该值为True。仅应用于工作表。Boolean 类型，可读写。此属性与“打印-批注”选项对应。

此属性设置为 True 与 PrintComments 属性设置为 xlPrintSheetEnd 效果相同。此属性设置为 False 与 PrintComments 属性设置为xlPrintNoComments 效果相同。
```
即：
PrintComments=xlPrintSheetEnd 等同于 PrintNotes=True
PrintComments= xlPrintNoComments 等同于 PrintNotes=False
```
7、PrintArea：以字符串返回或设置要打印的区域，该字符串使用宏语言的 A1样式的引用。String 类型，可读写。

此属性与“打印区域”选项对应。将该属性设置为 False 或空字符串 ("")，可打印整个工作表。
```
Worksheets("Sheet1").PageSetup.PrintArea = "$A$1:$C$5"
```
8、Order：返回或设置一个 XlOrder 值，它代表 MicrosoftExcel 打印一张大工作表时所使用的页编号的次序。此属性与“打印顺序”选项对应。
```
名称 值 描述 选项设置值
xlDownThenOver 1 向下处理行，然后向右逐个处理页或页面字段。 先列后行
xlOverThenDown 2 向右逐个处理页或页面字段，然后向下处理行。 先行后列
```
9、PrintGridlines：如果在页面上打印单元格网格线，则该值为 True。仅应用于工作表。Boolean 类型，可读写。此属性与“打印-网格线”选项对应。


10、PrintTitleRows：返回或设置那些包含在每一页顶部重复出现的单元格的行，用宏语言字符串以 A1 样式表示法表示。String 类型，可读写。此属性与“顶端标题行”选项对应。

如果仅指定行的一部分，Microsoft Excel 将把该区域扩展为整个行。将该属性设置为 False 或空字符串 ("")，将会关闭标题行。

11、PrintTitleColumns：返回或设置包含在每一页的左边重复出现的单元格的列，用宏语言 A1-样式中的字符串表示。String 类型，可读写。此属性与“左端标题行”选项对应。
如果仅指定列的一部分，Microsoft Excel 将自动把该区域扩展为整个列。（加一个例子）将该属性设置为 False 或空字符串 ("")，将会关闭标题列。

###五、 与选项卡无对应关系的属性有 7 个。

分别为：`Application、Creator、EvenPage、FirstPage、Pages、Parent、ChartSize`。

1、Application 如果不使用对象识别符，则该属性返回一个 Application 对象，该对象表示 MicrosoftExcel 应用程序。如果使用对象识别符，则该属性返回一个表示指定对象（可对一个 OLE 自动操作对象使用本属性来返回该对象的应用程序）

创建者的 Application 对象。只读。

执行代码：
```
ActiveSheet.PageSetup.Application.Name，可以返回应用程序的名称“Microsoft Excel”
```
2、Creator 返回一个 32 位整数，该整数指示在其中创建此对象的应用程序。只读 Long 类型。


执行代码：
```
ActiveSheet.PageSetup.Creator，返回数字 1480803660，相当于十六进制的 5843454C，即 XCEL 的 ACSII 码组合。微软拥有创建 XCEL 的代码。
```
3、EvenPage 返回或设置工作簿或节的偶数页上的文本对齐方式。

```
EvenPage.LeftHeader.Text 设置偶页的左页眉
EvenPage.CenterHeader.Text 设置偶页的中页眉
EvenPage.RightHeader.Text 设置偶页的右页眉
EvenPage.LeftFooter.Text 设置偶页的左页脚
EvenPage.CenterFooter.Text 设置偶页的中页脚
EvenPage.RightFooter.Text 设置偶页的右页脚
```
4、FirstPage 返回或设置工作簿或节的第一页上的文本对齐方式。
```
FirstPage.LeftHeader.Text 设置第一页的左页眉
FirstPage.CenterHeader.Text 设置第一页的中页眉
FirstPage.RightHeader.Text 设置第一页的右页眉
FirstPage.LeftFooter.Text 设置第一页的左页脚
FirstPage.CenterFooter.Text 设置第一页的中页脚
FirstPage.RightFooter.Text 设置第一页的右页脚
```
5、Pages 返回或设置 Pages 集合中的页数。
```
Pages.Count 代表工作表打印的页面数量。
```
6、Parent 返回指定对象的父对象。只读。代 表 PageSetup 的 父 对 象 ， 也 就 是 WorSheet 对 象 。 

运 行 代 码 ：
```
ActiveSheet.PageSetup.Parent.Name，获得当前工作表的名称。

```
7、ChartSize 返回或设置图表为适应页面大小而进行缩放的方式。本示例设置“Chart1”中央标题的文字。

```
Charts("Chart1").PageSetup.CenterHeader = "December Sales"
```

![](https://upload-images.jianshu.io/upload_images/6943526-1aab1c79efae6045.gif?imageMogr2/auto-orient/strip)
