---
title: 'spring 에서 retrofit 으로 soap 통신 하기.'
pubDate: 2022-04-14
description: 'Custom soap converter 를 사용하면 soap xmlns 통신이 충분히 가능하다x'
---

## 이 글을 쓰는 동기

요즘 많은 서비스들이 http 통신을 통해 서비스를 제공한다.
그 중 많은 서비스들이 restful 정신에 일부를 가져와 http 프로토콜을 적극 사용한다.

그러다보니 soap 통신은 찾기 어려워졌고 대부분의 필자가 웹 서비스를 공부하고 개발할 때는 거의 보지 못했다.
하지만 또 soap 통신을 안쓰는 것은 아니기에 필요하다면 soap 통신을 해야한다고는 생각했다.

필자가 사용하는 서비스에서는 soap 통신이 필요해졌는데 soap 통신을 위해 거대한 통신 클라이언트를 가져오기에는 거부감이 들었다.
기존에 사용하는 okhttp 계열의 retrofit 클라이언트에서 soap 통신을 추가할 수 있는 방법이 없을까 해서 포스트를 쓴다.

## 준비

soap 통신을 위해 사용하는 converter 와 데이터들이 어떻게 오고 가는지 로그를 찍기 위해 아래 두 의존성을 추가해주자.

> 로깅은 필수가 아니다. 필요 없는 경우는 추가 하지 않아도 된다.

```kotlin
// xml 변환을 위해 필요
implementation ("com.squareup.retrofit2:converter-jaxb:${사용하는 retrofit 버전}")
// 로깅을 위해 사용. 필수는 아님
implementation ("com.squareup.okhttp3:logging-interceptor:${사용하는 retrofit 이 의존하는 okhttp3 버전}")"
```

## soap

일반적인 soap 통신에서 xml 모양은 아래와 유사하다.

```xml
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
    <SOAP-ENV:Body-ENV:Body>
        <getProductDetails xmlns="http://warehouse.example.com/ws">
        <productId>827635</productId>
        </getProductDetails>
    </SOAP-ENV:Body-ENV:Body>
</SOAP-ENV:Envelope>
```

또는 WSDL 스키마를 사용한다면 아래와 유사하다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
   xmlns:soapenv=http://schemas.xmlsoap.org/soap/envelope/
   xmlns:xsd=http://www.w3.org/2001/XMLSchema
   xmlns:xsi=http://www.w3.org/2001/XMLSchema-instance>
   <soapenv:Body >
      <method:whatsYourName xsi:type="xsd:any">
         <age>4</age>
         <name>john</name>
      </method:whatsYourName>
   </soapenv:Body>
</soapenv:Envelope>
```

필자가 필요했던 soap 통신에서는 xmlns 스키마를 사용했기 때문에 xmlns 위주로 설명하겠다.

## Soap Converter

retrofit 을 사용할 때 json 방식으로 통신을 한다면 보통 JacksonConverterFactory 를 사용한다.
우리는 soap 통신 방식을 사용해야하기 때문에 SoapConverterFactory 를 만들어 구현해주자.

```kotlin
class SoapConverterFactory(val context: JAXBContext?) : Converter.Factory()
```

Converter.Factory() 를 상속하기 때문에 requestBodyConverter, responseBodyConverter 를 구현해주어야한다.

```kotlin
companion object {
    val XML = MediaType.get("application/xml; charset=utf-8")
}

override fun requestBodyConverter(
    type: Type,
    parameterAnnotations: Array<out Annotation>,
    methodAnnotations: Array<out Annotation>,
    retrofit: Retrofit
): Converter<*, RequestBody>? {
    // 타입이 클래스인지, 해당 클래스에 @XmlRootElement annotation 이 달려있는지 확인한다
    return if (type is Class<*> && type.isAnnotationPresent(XmlRootElement::class.java)) {
        // 이후에 구현할 예정인 RequestConverter
        SoapRequestConverter(contextForType(type), type)
    } else null
}

override fun responseBodyConverter(
    type: Type,
    annotations: Array<out Annotation>,
    retrofit: Retrofit
): Converter<ResponseBody, *>? {
    // 마찬가지로 @XmlRootElement 가 달려있는지 확인한다
    return if (type is Class<*> && type.isAnnotationPresent(XmlRootElement::class.java)) {
        // 이후에 구현할 예정인 ResponseConverter
        SoapResponseConverter(contextForType(type), type)
    } else null
}

private fun contextForType(type: Class<*>): JAXBContext {
    return try {
        JAXBContext.newInstance(type)
    } catch (e: JAXBException) {
        throw IllegalArgumentException(e)
    }
}
```

### XML

이후에 xml 인코딩 정보를 가져오기 위해 선언한다.

### requestBodyConverter

파라메터로 정보를 받지만 request 프레임이 될 객체를 조사하기 위해 type 정보만 있으면 된다.
이 객체가 클래스인지, XmlRootElement annotation 이 달려있는지 확인한다.

### responseBodyConverter

마찬가지로 response 프레임이 될 객체가 클래스인지 XmlRootElement annotation 이 달려있는지 확인한다.

### contextForType

JAXBContext.newInstance(type) 의 Exception 을 잡기 위해 함수화 했다. 정확하게 동작한다고 확신한다면 필요없을 것 같지만, 참고하는 블로그에서 사용하고 있었고
필자또한 오류를 잡아나가는 패턴은 중요하다 생각하기 때문에 구현하는 것이 좋다 판단했다.

## SoapRequestConverter

requestBodyConverter 의 반환타입에 맞게 Converter 를 상속해주어야한다.

```kotlin
class SoapRequestConverter<T>(
    val context: JAXBContext,
    val type: Class<T>
) : Converter<T, RequestBody> {

    private val xmlOutputFactory: XMLOutputFactory = XMLOutputFactory.newInstance()

    override fun convert(value: T): RequestBody? {
        val buffer = Buffer()
        try {
            val marshaller = context.createMarshaller()
            // 커스텀한 namespacePrefixMapper 를 사용하도록 세팅한다.
            marshaller.setProperty("com.custom.xml.bind.namespacePrefixMapper", RequestNamespacePrefixMapper())

            val xmlWriter = xmlOutputFactory.createXMLStreamWriter(
                buffer.outputStream(), SoapConverterFactory.XML.charset()!!.name()
            )

            marshaller.marshal(value, xmlWriter)
        } catch (e: JAXBException) {
            throw RuntimeException(e)
        } catch (e: XMLStreamException) {
            throw RuntimeException(e)
        }
        return RequestBody.create(SoapConverterFactory.XML, buffer.readByteString())
    }
}
```

marshaller.marshal 메서드가 진행되면 xml 구문이 해석이 된다.
그 전에 marshaller 를 구성해보자. marshaller 의 property 는 우리가 정의할 RequestNamespacePrefixMapper 를 사용한다.

## NamespacePrefixMapper

```kotlin
class RequestNamespacePrefixMapper : NamespacePrefixMapper() {

    companion object {
        private const val SOAP_ENVELOPE_PREFIX = "soapenv"
        private const val SOAP_ENVELOPE_URI = "http://schemas.xmlsoap.org/soap/envelope/"
    }

    override fun getPreferredPrefix(namespaceUri: String?, suggestion: String?, requirePrefix: Boolean): String? {
        return when (namespaceUri) {
            // namespace uri 가 soap envelope에 붙어야 할 namespace uri 와 같으면 soapenv 를 prefix 로 붙는다
            SOAP_ENVELOPE_URI -> SOAP_ENVELOPE_PREFIX
            else -> suggestion
        }
    }

    // root element 에 선언되어야할 namespace uri 들을 반환한다.
    override fun getPreDeclaredNamespaceUris(): Array<String> {
        // soap envelope에 붙어야할 namespace uri를 추가
        return arrayOf(SOAP_ENVELOPE_URI)
    }

    // RootElement 에 들어가는 namespace 를 추가로 정의한다.
    override fun getPreDeclaredNamespaceUris2(): Array<String> {
        return arrayOf("xsi", "http://www.w3.org/2001/XMLSchema-instance", "m", "http://www.xyz.org/quotations")
    }
}
```

이후 우리가 만들 Rquest 객체에 @XmlRootElement 어노테이션을 부여하고 namespace 에 "http://schemas.xmlsoap.org/soap/envelope/" 를 지정해줄 것이다.
그러면 getPreferredPrefix 메서드에서 이 것을 인지하고 soapenv 설정을 하고 getPreDeclaredNamespaceUris 메서드에서 해당 내용을 첨가하게 된다.
만약 추가로 정의할 내용이 있다면 getPreDeclaredNamespaceUris2 에서 정의하면 된다.

예시를 보자

```kotlin
@XmlRootElement(name = "Envelope", namespace = "http://schemas.xmlsoap.org/soap/envelope/")
data class PayLoadDTO(
    @field:XmlElement(name = "soapenv:Body")
    val body: PayloadBody? = null
)
```

XmlRootElement 어노테이션에 name 에 Envelope, namespace 에 값을 설정 했다.
namespace 값에 의해 요청을 보낼 root element 에는 soapenv 태그가 붙게 되고 name 값에 의해 Envelope 라는 값이 부여된다.
따라서 soapenv:Envelope 라는 형식으로 설정된다.

그리고 추가적으로 layer 를 두고 싶다면 XmlElement 를 이용하여 둘 수 있다. 위 예시의 경우
soapenv:Body 라는 태그가 생성된다.

## SoapResponseConverter

```kotlin
class SoapResponseConverter<T>(
    val context: JAXBContext,
    val type: Class<T>
) : Converter<ResponseBody, T> {

    private val xmlInputFactory = XMLInputFactory.newInstance()

    init {
        // Prevent XML External Entity attacks (XXE).
        xmlInputFactory.setProperty(XMLInputFactory.IS_SUPPORTING_EXTERNAL_ENTITIES, false)
        xmlInputFactory.setProperty(XMLInputFactory.SUPPORT_DTD, false)
    }

    override fun convert(value: ResponseBody): T? {
        return try {
            val unmarshaller = context.createUnmarshaller()
            val streamReader =
                xmlInputFactory.createXMLStreamReader(value.charStream())
            // nextTag() : 다음 element 를 발견할 때까지 스킵한다
            streamReader.nextTag() // soap:Envelope
            streamReader.nextTag() // soap:Body
            streamReader.nextTag() // 사용할 바디가 들어있는 stream
            // CustomStreamReaderDelegate : 엘리먼트들의 namespace 를 제거해줄 역할 수행
            val streamReaderDelegate = CustomStreamReaderDelegate(streamReader)
            unmarshaller.unmarshal(streamReaderDelegate, type).value
        } catch (e: JAXBException) {
            throw RuntimeException(e)
        } catch (e: XMLStreamException) {
            throw RuntimeException(e)
        } finally {
            value.close()
        }
    }
}
```

SoapResponseConverter 또한 SoapRequestConverter 와 유사하게 Converter 를 상속하여 구현해준다.
streamReader.nextTag 를 통해 우리가 원하는 값이 있는 layer 만 추출하는 코드다 예를들어 위의 코드의 경우 아래와 같은 형식의 xml 데이터를 읽을 수 있다.
만약 파싱하고자하는 xml 의 layer 가 더 많다면 추가적으로 해주는 것이 좋다.

```xml
<soapenv:Envelope>
    <soapenv:Body>
            HeyHey
    </soapenv:Body>
</soapenv:Envelope>
```

## data 가져오기

우리가 실질적으로 가져와야 하는 데이터는 soapenv:Body 하위의 데이터이다

```kotlin
data class PayloadBody(
    @field:XmlElement(name = "age")
    val linkCd: String? = null,
    @field:XmlElement(name = "name")
    val wDt: String? = null,
    @field:XmlElement(name = "birth")
    val iPv: String? = null,
)
```

위 의 데이터는 아래와 같은 폼을 저장할 수 있다.

```xml
<soapenv:Envelope>
    <soapenv:Body>
            <age>16</age>
            <name>Jonh</name>
            <birth>202204014</birth>
    </soapenv:Body>
</soapenv:Envelope>
```

만약 레트로핏 설정에서 logging interceptor 를 추가했었다면 통신할 때 어떤 데이터들이 오고가는지 알 수 있다.

## 후기

soap 통신이 호환이 잘 안된다고해서 나쁜 방법으나니라 생각한다. 다만 쉽게 호환되는 그리고 널리 쓰이는 데에는 이유가 있는 것 같다는 생각이 든다.

## 출처

- https://zorba91.tistory.com/324
- https://zorba91.tistory.com/318
- https://ko.wikipedia.org/wiki/SOAP
- https://www.ibm.com/docs/ko/rtw/9.0.0?topic=documents-structure-wsdl-message#wp1011906__wp1011912
