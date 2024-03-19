# WebGL

## WebGL

### 概念

`WebGL智能绘制三种图元：点、线、三角形。`可以用三角形绘制任何想绘制的东西。

[WebGL浅入浅出](https://zhuanlan.zhihu.com/p/337460642)

`顶点着色器` 描述定点特性（位置、尺寸）
`片元着色器` 描述片元（像素）处理过程

void gl.drawArrays(mode,first,count)
mode指定绘制图元的方式:
1. gl.POINTS 绘制一些列点
2. gl.LINE_STRIP 绘制一系列线段。上点连接下点。
3. gl.LINE_LOOP 绘制一个线圈。上点连接下点，最后一个点连接第一个点。
4. gl.LINES 绘制一系列单独线段。线段之间不连接
5. gl.TRIANGLE_STRIP 绘制一个三角带
6. gl.TRIANGLE_FAN 绘制一个三角扇
7. gl.TRIANGLES 绘制一系列三角形。每三个点作为顶点。
