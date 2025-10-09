---
title: 'Spring Jpa OneToMany 관계 Best Practice'
pubDate: 2022-11-13
description: '단방향 OneToMany 보다는 양방향 OneToMany 가 일반적으로 좋은 선택이다.'
heroImage: "../../../assets/heroes/spring-persistence-core.png"
---

# Spring Boot Persistence Best Practices 정리 글입니다.

- 부모 테이블, 엔티티를 부모라고 하겠습니다.
- 자식 테이블, 엔티티를 자식이라고 하겠습니다.

# OneToMany 관계

Spring Boot Persistence Best Practices 도서의 예제에 따라 저자와 책을 기준으로 정리하겠습니다.

한 명의 저자는 여러 개의 책과 연관됩니다. 저자(Author)는 부모 테이블이, 책(book)은 자식 테이블이 됩니다.
코드로 보자면 아래와 같습니다.

```kotlin
@Entity
@Table(name = "author")
class Author(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val name: String,
    val genre: String,
    @OneToMany(cascade = [CascadeType.ALL], mappedBy = "author")
    val book: List<Book>
)

@Entity
@Table(name = "book")
class Book(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val title: String,
    @ManyToOne
    val author: Author
)
```

## 항상 부모에서 자식에게 Cascade 관계를 설정하세요.

Cascade 는 부모에서 자식으로 전파되는 것이 일반적으로 좋습니다.
부모(Author)에서 addBook 과 같이 자식을 추가할 것은 일반적이나 자식(Book)에서 setAuthor 와 같이 부모를 설정하는 일은 일반적이지 않기 때문입니다.

```kotlin
@OneToMany(cascade = CascadeType.ALL)
```

## 부모 쪽에 mappedBy 를 설정하세요.

mappedBy 를 설정하면 어떤쪽의 테이블에서 foreign key 를 업데이트 해야하는지 명시해줄 수 있습니다.
양방향 관계에서 OneToMany 어노테이션 설정값에 mappedBy 를 설정해주세요. 중간 테이블을 생기는 현상을 방지할 수 있습니다.

```kotlin
@OneToMany(cascade = CascadeType.ALL, mappedBy = "author")
```

> 단방향 ManyToOne 일 경우 mappedBy 는 생략해도 됩니다.

## 부모 쪽에 orphanRemoval 설정을 해주세요.

orphanRemoval 값을 ture 로 두면 부모 엔티티에서 자식 엔티티에 대한 관계정보가 사라지면, 해당 자식 테입블에서 데이터 삭제까지 작업하게 됩니다.

```kotlin
@OneToMany(cascade = CascadeType.ALL, mappedBy = "author", orphanRemoval = true)
```

아래 코드는 orphanRemoval 값이 true 로 설정되었을 때에 관한 코드 내용입니다.

```kotlin
@Test
fun authorBookTest3() {
    val author = authorRepository.findById(1).orElseThrow()
    author.book.removeAt(1)
    authorRepository.save(author)
}

