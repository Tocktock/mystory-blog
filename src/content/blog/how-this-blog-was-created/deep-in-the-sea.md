---
title: 'javascript 로 블로그 포스트 가져오기.'
pubDate: 2022-01-13
description: '함수와 함수와 함수와 함수였다.'
heroImage: "../../../assets/heroes/content-deep-sea.png"
---

# 함수와 함수와 함수와 함수.

```
    pages/blog/[...slug].js
```

이 파일의 getStaticPaths 함수는 getFiles 이라는 함수를 호출하여 포스트 정보를 가져온다.
어떻게 가져오는지 알아보자.

> 구조보다는 함수를 분석하는 내용이니 지루할 수 있습니다.

## getFiles 함수

먼저 이 getFiles 함수는 /lib/mdx 라는 파일에 존재한다.
이 함수에서는 root path 를 가져온 후 data 와 함수의 파라미터였던 'blog' 값을 path 로 합친다.

결론적으로 ~/data/blog 의 형태가 될 것이다.

그리고 getAllFilesRecursively 라는 함수의 인자로 호출한다.

## getAllFilesRecursively

함수의 이름을 보자. 파일을 재귀적으로 가져오겠다는 것이다. 추측컨데 해당 폴더의 모든 트리를 가져올 것이다.

```javascript
const getAllFilesRecursively = (folder) =>
  pipe(fs.readdirSync, map(pipe(pathJoinPrefix(folder), walkDir)), flattenArray)(folder)
```

???

> 🗒️ "I got it!" 메모 이미지가 있던 자리 — 함수 호출 흐름을 도식화한 메모를 상상해 보세요.

## 함수 뽀개기

pipe 함수 먼저 봅시다.

```javascript
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x)
```

pipe 는 함수들을 받아서 x 인자들을 통해 각각 실행하는 구문입니다.

실자 사용예를 보면 folder 는 fs.readdirSync 의 인자로 들어가게 되고, 그 리턴된 값들은 다시 map(pipe(pathJoinPrefix(folder), walkDir)) 의 인자로 그 값에서 리턴된 값들은 flattenArray 함수로 흘러가게 되는 것입니다.

```javascript
    fs.readdirSync(folder) 에서 리턴된 값으로
    map(pipe(pathJoinPrefix(folder), walk))(리턴된 값) 을 호출하고 여기서 리턴된 값으로
    flattenArray(리턴된 값) 을 호출한다.
```

결론적으로 getAllFilesRecursively 함수는 data/blog 아래의 파일들의 경로들을 리턴하고 된다.
이를 가공하여 getFiles 함수는 data/blog 아래에 있는 값들만 추출하게 된다

```
getFiles 가 리턴하는 값들 예시.

[
  'how-this-blog-was-created/deep-in-the-sea.mdx',
  'how-this-blog-was-created/how-indexjs-can-read-mdx.mdx',
  'how-this-blog-was-created/how-post-is-created.mdx',
  'how-this-blog-was-created/i-got-it.png',
]
```

## getStaticProps

이 함수에서도 비슷하게 getAllFilesRecursively 함수를 호출하여 파일들의 절대 경로를 가져오고, 읽은 다음.
gray-matter 모듈을 이용하여 해당 파일을 파싱하여 파일의 정보를 얻게 된다.
