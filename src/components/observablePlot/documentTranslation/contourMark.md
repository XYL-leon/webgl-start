# Contour mark 等高线标记

## TIP

To produce a heatmap instead of contours, see the raster mark. For contours of estimated point density, see the density mark.
若需生成热力图而非等值线，请参阅栅格标记。若需显示估计点密度的等值线，请参阅密度标记。

### 内容

The contour mark draws isolines to delineate regions above and below a particular continuous value. These contours are computed by applying the marching squares algorithm to a discrete grid. Like the raster mark, the grid can be constructed either by interpolating spatial samples (arbitrary points in x and y) or by sampling a continuous function f(x,y) along the grid.
等值线标记通过绘制等值线划分特定连续值的上下区域。这些等值线通过对离散网格应用行进方块算法计算得出。与栅格标记类似，网格可通过插值空间样本（x和y方向的任意点）或沿网格对连续函数f(x,y)取样来构建。

For example, the contours below show the topography of the Maungawhau volcano, produced from a 87×61 grid of elevation samples.
例如下方等高线展示了芒加瓦火山地形，该图基于87×61网格的海拔样本生成。

### 使用总结

注意：

1. 不设置blur时每个点都具有颜色范围
2. 图例阈值等差或可熵减

总结：

1. 将数据按照阈值切割分组，那么实际渲染效果将直接跟阈值绑定而不是跟数据本身绑定
2. interval是将阈值按照什么精度切割分组。当一组数据存在差值较大时，会影响计算性能。如降水图例，最大值为200，最小有效值为0.1，此时interval设置为0.1则会生成2000个分组，计算量较大，渲染性能会下降。这种情况在设置stroke时同样会有影响，表现时峰值和谷值处会出现多条等高线重叠的现象，影响视觉效果。
