---
title: '코틀린 json serializer 만들어보기'
pubDate: 2022-03-14
description: '코틀린 Serializer 는 리플렉션을 통해 만들 수 있다.'
---

## 지난포스트에서..

이전 포스트에서 코틀린 어노테이션과 리플렉션에 대해서 알아보았다.
코틀린 리플렉션을 쓰면 런타임에 클래스 정보를 분석할 수 있다.

# Json Serializer

Serializer(직렬화) 란 Object 정보를 Json 형식의 데이터로 변환해주는 것을 말한다.
이를 구현하는 메서드는 아래 형태로 명세가 가능할 것이다.

```kotlin
fun serialize(object : Any) : String
```

우리가 필요한 것은 Object 의 각 프로퍼티의 이름과 가지고 있는 값과 타입이다. 이전 포스트에서 KClass 를 쓰면 프로퍼티의 이름과 값을 가져올 수 있는 것을 확인했다.
따라서 한 프로퍼티의 값을 표현하기 위해서는

```kotlin
""""${property.name}": "${property.getter.call(obj)}""""
```

이와 같이 표현할 수 있다.
따라서 이제 각 멤버프로퍼티를 joinToString 을 통해 위 같은 구조로 호출해주면 json 형식의 String 값을 얻을 수 있다.

```kotlin
obj::class.memberProperties.joinToString(", ", "{", "}") { property ->
            """"${property.name}": "${property.getter.call(obj)}""""
        }

// 출력
// {"code": "200", "from": "browser", "message": "hello"}
```

json 형식에도 숫자와 불리언 형식은 존재하기 때문에 모두 스트링으로 처리하기에는 무리가 있다.
KClass 의 각 멤버프로퍼티인 KProperty 에는 returnType 이라는 프로퍼티가 존재한다. 이는 KProperty 의 get 을 호출했을 때 반환하는 타입을 알려준다.

```kotlin
private fun toReturnTypeString(obj: Any, property: KProperty1<out Any, *>): String {
    return when (property.returnType.javaType) {
        Int::class.java -> "${property.getter.call(obj)}"
        String::class.java -> """"${property.getter.call(obj)}""""
        Boolean::class.java -> "${property.getter.call(obj) == true}"
        else -> throw IllegalArgumentException("처리할 수 없는 타입입니다.")
    }
}

// KProperty1 은 kotlin.reflect 에 있다.
```

# 어노테이션 적용해보기

리플렉션을 이용하여 클래스 정보를 얻어오는 것은 정상적으로 수행되었다. 리플렉션 자체만으로도 기능을 수행할 수 있다는 것을 알 수 있다.
이제 어노테이션을 통해 리플렉션만으로 작업할 수 없는 내용을 수행해보고자 한다.

어노테이션은 목표가 되는 클래스 또는 프로퍼티에 의미 또는 정보를 추가해주는 역할을 해준다.
프로젝트 내에서 사용되는 단어와 외부적으로 사용되는 단어가 달라 Serializer 에서 Json 의 필드 매핑을 다르게 해야하는 요구사항이 생겼다고 생각해보자.
이 경우 어노테이션을 사용하면 효과적으로 처리할 수 있다.

```kotlin
@Target(AnnotationTarget.PROPERTY)
annotation class JsonProperty(val name: String)
```

위 같이 어노테이션을 선언해주고 원하는 곳에 적용해보자.
요구사항은 프로젝트의 HelloRequestDTO 내에서는 "from" 이라는 이름으로, 외부에서는 "sender" 라는 이름을 사용한다고 가정해보자.

```kotlin
data class HelloRequestDTO(
    @JsonProperty("sender") val from: String,
    val message: String,
    val code: Int,
    val reply: Boolean,
)
```

어노테이션을 통해 우리가 원하는 정보를 추가해주었다. 이를 Serializer 에 적용하여 필드 이름을 가져오는 코드를 새로 작성해보자.

```kotlin
private fun getFieldName(property: KProperty1<out Any, *>): String {
    return property.findAnnotation<JsonProperty>()?.name ?: property.name
}
```

리플렉션에서 findAnnotation 를 통해 원하는 어노테이션을 가져올 수 있다.

필자가 작성한 전체 코드는 아래와 같다.

```
import kotlin.reflect.KProperty1
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.memberProperties
import kotlin.reflect.jvm.javaType

class JsonMapper {

    fun objectToJson(obj: Any): String {
        return obj::class.memberProperties.joinToString(", ", "{", "}") { property ->
            """"${getFieldName(property)}": ${toReturnTypeString(obj, property)}"""
        }
    }

    private fun getFieldName(property: KProperty1<out Any, *>): String {
        return property.findAnnotation<JsonProperty>()?.name ?: property.name
    }

    private fun toReturnTypeString(obj: Any, property: KProperty1<out Any, *>): String {
        return when (property.returnType.javaType) {
            Int::class.java -> "${property.getter.call(obj)}"
            String::class.java -> """"${property.getter.call(obj)}""""
            Boolean::class.java -> "${property.getter.call(obj) == true}"
            else -> throw IllegalArgumentException("처리할 수 없는 타입입니다.")
        }
    }
}
```

# 후기

리플렉션을 이용하여 Object 를 Json 형식으로 변환하는 간단한 Serializer 를 만들었다.
어노테이션을 사용하면 리플렉션의 기능을 유연하게 사용할 수 있는 것을 확인해보았다.
다만 여기서는 List 또는 거스텀 객체 등에 대한 내용은 없다. 직접 구현해본다면 리플렉션을 이해하는데 더 도움이 될 것이라 생각한다.

다음 포스트에서는 Json 형식의 스트링을 Object 로 매핑하는 내용을 다뤄볼까 한다.
