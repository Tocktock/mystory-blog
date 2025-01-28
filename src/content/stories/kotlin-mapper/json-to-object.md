---
title: '코틀린 json deserializer 만들어보기'
publishDate: 2022-03-22
description: '코틀린 Deserializer 는 코틀린 리플렉션을 통해 만들 수 있다.'
---

## TLDR

```kotlin
fun <T : Any> jsonToObject(jsonStr: String, targetClass: KClass<T>): T {
    val parsed = parseJsonString(jsonStr)
    val parameterInfo = mutableMapOf<KParameter, Any?>()
    targetClass.primaryConstructor?.parameters?.forEach {
        parameterInfo[it] = parsed[it.name]
    }
    return targetClass.primaryConstructor?.callBy(parameterInfo)!!
}
```

## 지난 포스트...

이전 포스트에서 코틀린 리플렉션을 이용하여 object 정보를 json 으로 변환하는 과정을 살펴보았다.
코틀린 리플렉션을 살펴보는 과정에서

- 멤버프로퍼티의 반환타입을 확인하는 것.
- 어노테이션을 확인하여 필드이름을 변경하는 것.

을 확인하였다.

이번 포스트에서는 json 정보를 object 로 변환하는 과정 (Deserialize) 을 살펴보려고 한다.

## 들어가기에 앞서...

json 정보를 object 로 변환하기 위해서는 먼저 json 정보를 파싱하는 과정이 필요하다. 예를들어 json 정보를 적절한 key-value 정보로 먼저 추출한 다음
그 정보를 토대로 오브젝트의 프로퍼티이름에 key 를 값에 value 를 매핑시켜줘야한다. json 정보를 파싱하는 과정은 이 포스트가 전달하고자 하는 범위에 벗어나기 때문에
이미 적절한 key-value 값으로 파싱되어 있다 가정하고 진행할 것이다.

# 제너릭

Deserializer 는 json 정보를 어떤 형태의 object 에 매핑해야하는지 알 수 없다. 따라서 이 object 정보를 같이 제공해줘야하는데 이 때 제너릭 기능을 사용하면
보편적으로 사용하기 편하다.

> 제너릭이란 간단하게 object 에 대한 정보를 외부에서 명시해주는 것이라 생각하면 편하다.

클래스에 대한 정보를 코틀린 클래스 레퍼런스인 KClass 로 제공해주면 된다.
함수에 대한 명세는 아래와 같다.

```kotlin
fun <T : Any> jsonToObject(jsonStr: String, targetClass: KClass<T>): T
```

jsonToObject 함수는 json 정보를 받아 우리가 원하는 객체 타입으로 Deserialize 한 다음 반환해주는 역할을 하게 된다.

# 임의 파서

앞서 말했듯, json 파서를 구현하는 것은 포스트가 전달하고자 하는 범위에 벗어나기 때문에 임의의 key-value 의 데이터를 정상적으로 파싱 했다 가정하고 진행하자.
이전 포스트에서 다루었던 HelloRequestDTO 객체를 예시로 사용하자.

```kotlin
data class HelloRequestDTO(
    val from: String,
    val message: String,
    val code: Int,
    val reply: Boolean,
)
```

```kotlin
// 임의 파서
private fun parseJsonString(jsonStr: String): Map<String, Any> {
    val map = mutableMapOf<String, Any>()
    map["code"] = 200
    map["from"] = "browser"
    map["message"] = "hello my friend"
    map["reply"] = true
    return map
}
```

# 리플렉션으로 Constructor 사용

> 리플렉션으로 Primary Constructor 를 사용한다고 가정한다.

리플렉션의 Primary Constructor 의 파라메터들을 넘겨주기 위해 어떤 파라메터들이 있는지 먼저 살펴보자.
리플렉션으로 Primary Constructor 를 사용하기 위해서는 KClass 의 primaryConstructor 정보에 접근해야한다.
KClass 의 primaryConstructor 에서 우리가 살펴볼 정보로는

- 파라메터 정보를 가지고 있는 parameters.
- Primary Constructor 를 호출하기 위한 callBy.

```kotlin
// 파라메터 List<KParameter> 를 반환
targetClass.primaryConstructor?.parameters?
```

primaryConstructor 를 호출하는 callBy 메서드는 아래와 같은 명세를 가진다.

```kotlin
// 명세
public fun callBy(args: Map<KParameter, Any?>): R

// primaryConstructor 호출 방법.
targetClass.primaryConstructor?.callBy(args)
```

이제 Deserialize 에 필요한 조각들은 모두 모였다.

1. json 파싱
2. 파라메터 정보들을 가져와서 적절한 값으로 매핑
3. primaryConstructor 호출

jsonToObject 의 전체 코드는 아래와 같다.

```kotlin
fun <T : Any> jsonToObject(jsonStr: String, targetClass: KClass<T>): T {
    val parsed = parseJsonString(jsonStr)
    val parameterInfo = mutableMapOf<KParameter, Any?>()
    targetClass.primaryConstructor?.parameters?.forEach {
        parameterInfo[it] = parsed[it.name]
    }
    return targetClass.primaryConstructor?.callBy(parameterInfo)!!
}
```

정상적으로 작동하는지 확인해보자.

```kotlin
@Test
fun `json to object 테스트`() {
    val jsonStr = """{"code": 200, "sender": "browser", "message": "hello", "reply": false}"""
    val obj = jsonMapper.jsonToObject(jsonStr, HelloRequestDTO::class)
    println(obj)
}
```

메서드를 실행하면 정상적으로 HelloRequestDTO object 가 만들어진 것을 알 수 있다.

# 후기

이번 포스트에서는 어노테이션에 대한 정보는 다루지 않았다. 어노테이션에 따라 필드 이름을 다르게 받는다던지, 또는 Deserialize 할 필드를 제외한다는 행동을 구현한다면 재미있을 것 같다.
코틀린 리플렉션은 상당히 많은 기능을 가진 것 같다. 잘 사용한다면 프로젝트에서 자주 사용하는 기능들을 더 쉽게 사용할 수 있도록 도와줄 수 있을 것이라 생각이든다.

리플렉션 관련 시리즈는 여기까지이다.
