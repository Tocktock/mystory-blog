---
title: 'kotlin toString 을 사용하다 생긴 오류'
pubDate: 2022-03-31
description: '코틀린에서 사용하는 toString() 은 종류가 하나가 아니다.'
---

# `?` 이 syntax 는 무슨 역할을 할까?.

## Any?.toString() 과 Any.toString()

```kotlin
fun shockedFun(root : Root?) {
    val nullableStr = root?.one.toString()
    ...
}
data class Root(
    val one: DepthOne?
)

data class DepthOne(
    val two : DepthTwo?
)
```

nullableStr 은 어떤 데이터를 가지고 있을까요?

저는 root 가 null 이라면 nullableStr 은 당연히 null 일 것이라 생각을 했습니다.
하지만 nullableStr "null" 값을 가질 수 있다는 것을 알아차린 것은 이미 사고가 터진 이후였습니다.

차분하게 nullableStr 변수 위에 마우스를 올리니 String 이라고 표시가 되었습니다..
위의 shockedFun 과 아래 fixedFun 의 차이는 Any? 타입의 확장함수를 쓰냐 Any 타입의 내장함수를 쓰냐의 차이입니다.

```kotlin
fun fixedFun(root : Root?) {
    val nullableStr = root?.one?.toString()
    ...
}
```

위와 같은 상황을 겪으니 갑자기 `?` 이 syntax 가 낯설어졌습니다.

## question mark `?`

### 존재이유

코틀린 바이블인 _kotlin in action_ 에는 null 과 관련된 오류를 런타임이 아닌 컴파일 타임에 잡기 위해 이 물음표와 비슷한 기능이 현대언어에 존재한다고 합니다.
왜 컴파일 타임에 잡으려고 할까요?

```java
int strLen(String s) {
    return s.length();
}
```

위 자바코드의 strlen 함수의 s 값에 null 이 들어오면 NullPointerException 이 발생합니다. 다시 말해 자바의 String 은 null 값이 될 수 런타임에 오류가 발생할 수 있습니다.
일반적응로 런타임에 오류가 발생하게 되면 로그를 까보거나 상황을 시뮬레이션 해야하는 상황이 생길 수 있고 직관적이지 못해 컴파일 타임에 오류를 잡는것이 훨씬 좋습니다.

### 코틀린에서 ? 이란

1. 타입뒤에 ? 이 나온다면 타입이 nullable 하다는 의미이고
2. 변수 뒤에 나오는 ? 는 if not null 이라는 의미를 내포합니다.

2 번은 예를 들자면

```kotlin
str?.toUpperCase()
// 위의 코드는 아래와 같습니다.
if(str != null) str.toUpperCase() else null
```

여기서 저는 한 번 더 궁금했습니다.

```kotlin
val nullableStr = root?.one.toString() // 이 코드는
val nullableStr = if(root != null) one.toString() else null // 왜 이렇게 해석되지 않는지.
```

root?.one.toString() 이 자바에서 의미하는 바는 무엇일까를 상상하며 설레는 마음으로 java 로 decompile 을 해보았습니다.

```java
// val nullableStr = root?.one.toString() 이 코드는
// 이렇게 decompile 이 되었습니다.
String nullableStr = String.valueOf(root != null ? root.getOne() : null);
```

java 의 Sring.valueOf() 메서드는 인자값이 null 일 경우 String 타입인 "null" 을 반환합니다.
왜 이렇게 되었을까를 생각해보니 String.valueOf 는 null 타입 또한 인자로 받을 수으며 one 또한 nullable 하기 때문에 위와 같이 번역된 것으로 생각합니다.
실제로 위의 코틀린 코드의 toString() 을 따라가보면 Any? 타입의 확장함수로 안내가 됩니다.

제가 원한대로 동작하기 위해서는 아래와 같이 작성되어야 합니다.

```kotlin
val nullableStr = root?.one?.toString()
```

## 결론..

지금 와서 생각해보면 당연한 결과였습니다. 자바를 제대로 학습하지 않은 채로 kotlin 을 먼저 학습한 것에 대한 역효과 일 수도 있다고 생각이 듭니다.
다만 intellij 가 실질적으로 예상타입을 보여주거나 특정 메서드는 기울임꼴로 표현하는 등 사용자 친화적인 기능이 많으므로 실수는 더욱 적어질 것이라 생각됩니다.