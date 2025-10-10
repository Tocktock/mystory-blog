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

--- 로그 ---
Hibernate: select a1_0.id,a1_0.genre,a1_0.name,b1_0.author_id,b1_0.id,b1_0.title from author a1_0 left join book b1_0 on a1_0.id=b1_0.author_id where a1_0.id=?
Hibernate: select a1_0.id,a1_0.genre,a1_0.name,b1_0.author_id,b1_0.id,b1_0.title from author a1_0 left join book b1_0 on a1_0.id=b1_0.author_id where a1_0.id=?
Hibernate: delete from book where id=?
```


종종 CascadeType.REMOVE 와 orphanRemoval 이 헷갈릴 수 있습니다.

- orphanRemoval: 자식 엔티티가 부모 엔티티에서 관계가 해제될 때 제거하는 것입니다.
- CascadeType.REMOVE: 부모 엔티티가 삭제될 때 모든 자식 엔티티를 제거하는 것입니다.

아래 코드는 CascadeType.REMOVE 에 관한 내용입니다.
```kotlin
@Test
fun authorBookTest() {
    val author = authorRepository.save(
        Author(
            id = null,
            name = "tars",
            genre = "SF",
            book = mutableListOf()
        )
    )

    val books = listOf(
        Book(id = null, title = "super fantasy", author),
        Book(id = null, "super sad", author)
        )
    bookRepository.saveAll(books)
    authorRepository.deleteById(author.id!!)
}
--- 로그 ---
Hibernate: insert into author (genre, name) values (?, ?)
Hibernate: insert into book (author_id, title) values (?, ?)
Hibernate: insert into book (author_id, title) values (?, ?)
Hibernate: select a1_0.id,a1_0.genre,a1_0.name from author a1_0 where a1_0.id=?
Hibernate: select b1_0.author_id,b1_0.id,b1_0.title from book b1_0 where b1_0.author_id=?
Hibernate: delete from book where id=?
Hibernate: delete from book where id=?
Hibernate: delete from author where id=?
```

## Fetching 관련

fetch 전략이 기본적으로 부모쪽에서는 Lazy 로, 자식쪽에서는 EAGER 로 설정되어 있습니다.
따라서 fetch 전략을 따로 설정하지 않을 경우 부모를 조회했다고 해서 자식을 바로 조회하지 않습니다. 반대로 자식을 조회할 경우 부모는 동시에 조회됩니다.

기본 설정된 fetch 전략을 수정해야하는 경우가 종종 있습니다. 그런 경우 주의해야할 점이 있습니다.

### lazy fetch 전략 주의할 점.

- Transaction 스코프 주의: lazy fetch 는 영속성 컨텍스트가 존재해야 사용할 수 있기 때문에 Transaction 스코프가 없는데서 자식을 조회할 경우 오류가 발생할 수 있습니다.
다만 enable_lazy_load_no_trans 프로퍼티를 true 로 설정하면 Transaction 스코프가 없어도 사용 가능합니다.

- toString 사용주의: lazy fetch 를 적용한 경우, toString 메서드에 lazy fetch 대상이 있다면 toString 을 호출하는 것만으로도 대상이 fetch 됩니다.
마찬가지로 코틀린의 data class 는 기본적으로 toString 메서드를 가지고 있기 때문에 예상하지 못한 결과가 나올 수 있습니다.
toString 을 사용해야하는 경우 toString 메서드를 오버라이딩 하여 lazy fetch 대상이 되는 엔티티를 제외하고 출력하도록 해야합니다.

### eager fetch 전략 주의할 점.

eager fetch 는 연관된 엔티티의 정보를 추가적인 쿼리 없이 바로 가져올 수 있다는 장점이 있지만 성능을 고려해서 사용해야합니다.
예를 들어 부모 - 자식1 - 자식2 - 자식3 구조에서 모두 eager 로 설정되어 있다면 부모만 조회해도 자식3까지 모두 조회가 됩니다. 이는 성능적으로 문제가 발생할 수 있습니다.

특히 queryDSL 을 사용할 경우 예상하지 못한 상황이 발생할 수 있습니다.

## 단방향 OneToMany 관계는 지양하는 것이 좋습니다.

아래에서 단방향 OneToMany 의 단점을 알아보겠습니다.

### 첫 번째 단점. 중간테이블 생성

단방향 OneToMany 로 사용한다면 자식에 외래키를 생성시킬 방법이 없어 중간단계 테이블이 생깁니다.
예를들어 Author 엔티티에만 OneToMany 를 작성하고 Book 엔티티에는 Author 와 연관관계 정보를 작성하지 않는다면 author_book 이라는 중간단계의 테이블이 생성됩니다.

중간테이블 때문에 book 을 저장할 경우 author_book, book 두 개의 테이블에 statement 가 발생합니다. 자식을 수정할 경우 더 문제가 될 수 있습니다.
아래 예시는 기존에 하나의 book 을 가진 author 에 다른 book 하나를 추가하는 경우입니다.

```sql
Hibernate: select a1_0.id,a1_0.genre,a1_0.name from author a1_0 where a1_0.id=?
Hibernate: select b1_0.author_id,b1_1.id,b1_1.title from author_book b1_0 join book b1_1 on b1_1.id=b1_0.book_id where b1_0.author_id=?
Hibernate: insert into book (title) values (?) ---- 1
Hibernate: delete from author_book where author_id=? ---- 2
Hibernate: insert into author_book (author_id, book_id) values (?, ?) ---- 3
Hibernate: insert into author_book (author_id, book_id) values (?, ?) ---- 4
```

2, 3, 4 번을 보면 author_book 테이블에서 연관 정보를 삭제한 후에 기존에 존재하던 book 에 대한 정보와 새로운 book 에 대한 정보를 insert 하는 비효율적인 statement 가 발생합니다.
이 저자가 수십권의 책을 가지고 있다면 더 비효율적이게 됩니다.

단방향 관계에서는 JoinColumn 을 설정하면 중간테이블 생성을 방지할 수 있습니다

```kotlin
@Entity
@Table(name = "author")
data class Author(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val name: String,
    val genre: String,
    @OneToMany(cascade = [CascadeType.ALL], orphanRemoval = true)
    @JoinColumn(name = "author_id")
    val book: MutableList<Book>
)
```

### 두 번째 단점. insert and update

JoinColumn 을 통해 중간테이블이 생성되지 않았어도 자식을 추가할 경우 insert and update 가 되는 현상이 발생합니다.

```kotlin
@Transactional
fun test() {
    val author = authorRepository.findFirstByNameOrderByIdDesc("셰익스피어")!!
    author.book.add(Book(null, "베니스의 상인"))
    author.book.add(Book(null, "맥베스"))
    author.book.add(Book(null, "햄릿의 비극"))
}
```

위 코드는 아래와 같은 결과를 발생시킵니다.

```sql
Hibernate: select a1_0.id,a1_0.genre,a1_0.name from author a1_0 where a1_0.id=?
Hibernate: select b1_0.author_id,b1_0.id,b1_0.title from book b1_0 where b1_0.author_id=?
Hibernate: insert into book (title) values (?)
Hibernate: insert into book (title) values (?)
Hibernate: insert into book (title) values (?)
Hibernate: update book set author_id=? where id=?
Hibernate: update book set author_id=? where id=?
Hibernate: update book set author_id=? where id=?
```

### 그 외

- 자식정보만 추가하거나 수정하는 경우 부모 정보가 없기 때문에 부모 정보는 null 로 저장됩니다.
- 자식을 delete 하는 경우에는 update and delete 를 하는 상황이 발생합니다. 자식의 부모정보를 null 로 만든후 delete 하게 됩니다.
