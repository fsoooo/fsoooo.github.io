**大O符号**是算法复杂度的相对表示，它描述了**时空复杂度（时间复杂度/空间复杂度）**。

大O符号是我在大学里学过的东西之一，我了解过这个算法的概念。我知道的不算多，可以回答一些基本的问题，仅此而已。从大学毕业以后，我对这个算法的了解基本没有改变，因为自从我开始工作以来，我没有使用过它，也没有听到任何同事提到过它。所以我想我应该花点时间回顾一下它，并在这篇文章中总结大O符号的基础知识，以及一些代码示例来帮助解释它。

####什么是大O符号?简而言之:

1.  它是算法复杂度的相对表示。

2.  它描述了一个算法如何执行和缩放。

3.  它描述了函数增长率的上限，可以考虑最坏的情况。

现在快速看一下语法:*O(n2)*。

**`n是函数作为输入接收的元素个数。这个例子是说，对于n个输入，它的复杂度等于n2。`**

####共同复杂性的比较

从这个表中可以看出，随着函数复杂度的增加，完成一个函数所需的计算量或时间可能会显著增加。因此，我们希望将这种增长保持在尽可能低的水平，因为如果函数不能很好地伸缩而增加了输入，可能会出现性能问题。

![显示操作数量如何随复杂性增加的图表](https://upload-images.jianshu.io/upload_images/6943526-6e850e39ee09d751?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


一些代码示例应该有助于澄清一些关于复杂性如何影响性能的问题。下面的代码是用Java编写的，但是很明显，它可以用其他语言编写。

![image](https://upload-images.jianshu.io/upload_images/6943526-d020734c4d00fc1e?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## O(1)

```
public boolean isFirstNumberEqualToOne(List<Integer> numbers) {
  return numbers.get(0) == 1;
}
```

O(1) 表示一个函数，无论输入大小如何，该函数总是取相同的值。

## O(n)

```
public boolean containsNumber(List<Integer> numbers, int comparisonNumber) {
  for(Integer number : numbers) {
    if(number == comparisonNumber) {
      return true;
    }
  }
  return false;
}
```

O(n)表示一个函数的复杂度，该函数的复杂度与输入的个数成线性正比增长。这是一个很好的例子，说明大O符号如何描述最坏的情况，因为函数在读取第一个元素后返回true，或者在读取所有n个元素后返回false。

## O(n2)

```
public static boolean containsDuplicates(List<String> input) {
  for (int outer = 0; outer < input.size(); outer++) {
    for (int inner = 0; inner < input.size(); inner++) {
      if (outer != inner && input.get(outer).equals(input.get(inner))) {
        return true;
      }
    }
  }
  return false;
}

```

*O(n2)*  表示一个函数，其复杂度与输入大小的平方成正比。通过输入添加更多的嵌套迭代将增加复杂性，然后可以用3次总迭代表示*O(n3)*，用4次总迭代表示**O(n4)* *。

```
public int fibonacci(int number) {
  if (number <= 1) {
    return number;
  } else {
    return fibonacci(number - 1) + fibonacci(number - 2);
  }
}
```
*O(2n)* 表示一个函数，其性能对输入中的每个元素都加倍。这个例子是斐波那契数列的递归计算。函数属于*O(2n)*，因为函数对每个输入数递归地调用自身两次，直到该数小于或等于1。

## O(log n)

```
public boolean containsNumber(List<Integer> numbers, int comparisonNumber) {
  int low = 0;
  int high = numbers.size() - 1;
  while (low <= high) {
    int middle = low + (high - low) / 2;
    if (comparisonNumber < numbers.get(middle)) {
      high = middle - 1;
    } else if (comparisonNumber > numbers.get(middle)) {
      low = middle + 1;
    } else {
      return true;
    }
  }
  return false;
}
```
O(log n)表示一个函数，该函数的复杂度随输入大小的增加呈对数增长。这使得O(log n)函数可以很好地伸缩，这样处理较大的输入就不太可能导致性能问题。
上面的示例使用二分查找来检查输入列表是否包含某个数字。简单地说，它在每次迭代中将列表一分为二，直到找到数字或读取最后一个元素。此方法具有与O(n)示例相同的功能，尽管实现完全不同且更难于理解。但是，这样做的回报是更大的输入会带来更好的性能(如表中所示)。

这种实现的缺点是二进制搜索依赖于元素已经处于正确的顺序。如果在遍历元素之前需要对元素进行排序，那么这就增加了一些开销。
