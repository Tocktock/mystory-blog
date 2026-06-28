---
title: 'Redux 기본서!! (feat. react context hook)'
pubDate: 2021-02-11T07:45:54.248Z
description: '기본 Redux 는 간단하게 작용합니다. 중앙화 된 상태저장소가 있고 각각의 컴포넌트들이 그 상태저장소에 접근해서 원하는 것을 가져올 수 있습니다. 자식들에게 상태(state)와 자산(props)을 물려줄 필요는 없습니다.Redux 를 구성하는 3가지 요소가 있습니다.'
heroImage: '../../../assets/heroes/redux.png'
category: 'tech'
series: 'react-redux'
seriesOrder: 1
tags:
  - redux
  - react
---

## 🔨 Redux 는 이렇게 작동합니다.

기본 Redux 는 간단하게 작용합니다. 중앙화 된 상태저장소가 있고 각각의 컴포넌트들이 그 상태저장소에 접근해서 원하는 것을 가져올 수 있습니다. 자식들에게 상태(state)와 자산(props)을 물려줄 필요는 없습니다.

Redux 를 구성하는 3가지 요소가 있습니다.

- **Actions**
- **Store**
- **Reducers**

## 🙂 Actions

간단하게 Actions 는 이벤트 데이터 입니다.
데이터는 심플한 Javascript Object 입니다. 다음처럼요.

```javascript
{
  type: REQUEST_ROBOTS_SUCCESS,
  isPending : false,
  payload: {
      robots : [some api call results]
}
```

이 Actions 를 dispatch 라는 함수를 통해 Redux Store 로 보내게 됩니다.

```javascript
dispatch({
  type: REQUEST_ROBOTS_SUCCESS,
  isPending : false,
  payload: {
      robots : [some api call results]
  }
});
```

## 🙂 Reducers

Reducers 는 순수함수입니다. 이전 상태 값을 받아 새로운 상태 값을 리턴하는 함수입니다.

> 순수함수란 값을 받아서 어떤 값을 다시 리턴 해주는 함수이며, 이때 동일한 값을 받으면 그 값에 대해서 항상 같은 값을 리턴해준다면 이를 순수함수라고 합니다..

dispatch 를 통해 action 을 받은 Reducer 는 action 의 타입에 따라 다른 행동을 합니다.

reqeustBots 라는 Reducer 를 예를 들면,

```javascript
export const requestRobots = (state=initialStateRobots, action={}) => {
  switch (action.type) {
    case REQUEST_ROBOTS_PENDING:
      return Object.assign({}, state, {isPending: true})
    case REQUEST_ROBOTS_SUCCESS:
      return Object.assign({}, state, {robots: action.payload, isPending: false})
    case REQUEST_ROBOTS_FAILED:
      return Object.assign({}, state, {error: action.payload})
    default:
      return state
  }
```

이처럼 생겼으며 순수함수 이므로 state 를 변화시킨다기 보다는 새로운 state 를 만들어 리턴하게 됩니다.

## 🙂 Store

store 는 앱의 state 를 가지고 있는 저장소입니다.

```javascript
const store = createStore(Reducers);
```

이 store 를 Redux 의 Provider 를 통해 앱으로 전달하게 됩니다.

```javascript
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

App 컴포넌트에서는 이 store 에 접근하기 위해 react-redux 라이브러리의 connect 함수를 통해 연결하게 됩니다.

```javascript
const mapStateToProps = (state) => {
  return {
    searchField: state.searchRobots.searchField,
    robots: state.requestRobots.robots,
    isPending: state.requestRobots.isPending,
  };
};

// dispatch the DOM changes to call an action. note mapStateToProps returns object, mapDispatchToProps returns function
// the function returns an object then uses connect to change the data from redecers.
const mapDispatchToProps = (dispatch) => {
  return {
    onSearchChange: (event) => dispatch(setSearchField(event.target.value)),
    onRequestRobots: () => dispatch(requestRobots()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

- mapStateToProps : 우리가 이 컴포넌트에서 사용할 state.
- mapDispatchToProps : 우리가 이 컴포넌트에서 사용할 actions 들을 dispatch 할 정보를 담은 함수.

---

## 🙂 Redux Middleware

Redux 에서는 Action 이 dispatch 되기 전 이를 가로채 가공할 수 있는 middleware 기능이 있습니다.

다음과 같이 사용 가능합니다.

```javascript
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
const store = createStore(
  rootReducers,
  applyMiddleware(thunkMiddleware, logger)
);
```

redux-thunk 는 비동기 수행에, redux-logger 는 로그를 남기기 위해 사용하는 middleware 입니다.

## 🙄 React Context hook

React 의 Context hook 또한 상태 관리를 위한 목적을 가지고 있습니다. Redux 에서와 비슷하게
Provider / Consumer 패턴으로 state 를 제공/ 소비를 할 수 있습니다.

Redux 와 비슷하게 state 를 관리할 수 있습니다. 그럼 왜 Redux 를 아직 사용할까요??

Redux 의 **장점**

- Debugging 과 Testing 하는데 편리합니다. Redux DevTools 또는 logger 등을 이용한다면 우리 앱에서 컴포넌트의 전환과정 사이에 어떤 일이 일어나는지 알 수 있습니다.
- Redux 는 어떻게 코드가 작성되어야 하는지 강요하는 구조입니다. 큰 규모의 앱에서 관리하기 수월합니다.
- Redux 내부적으로 최적화가 되어있고, 필요한 컴포넌트만 Rerender 할 수 있기 때문에 성능상에서 약간의 이득을 볼 수 있습니다.
- 로컬 스토리지에 상태를 영속적으로 저장하고 불러오는데 뛰어납니다.
- 초기 상태를 서버에 전송하여 필요한 컴포넌트를 render 할 수 있습니다. 따라서 SSR 에 강점이 있습니다.

위의 장점이 필요 없다면 React hooks 만 써도 됩니다.
필요 이상의 일을 할 필요가 없어지는 것 입니다.

그래서 모든 개발자가 React hooks 가 Redux 를 대체할 수 있나요? 라는 질문에
"아니요" 라고 대답하는 것 같습니다.

다만 React hooks 또는 React 관련 기능이 더 성장한다면 Redux 를 대체할 수도 있지 않을까 생각합니다.

---

참고 :

- <https://blog.logrocket.com/why-use-redux-reasons-with-clear-examples-d21bffd5835/>
- <https://www.ibrahima-ndaw.com/blog/7-steps-to-understand-react-redux/#2-what-is-redux-and-why-we-need-it>
- https://blog.asayer.io/do-you-really-need-redux-pros-and-cons-of-this-state-management-library
- Udemy 강의 - The Complete Junior to Senior Web Developer Roadmap (2021)

참고 예제 :

- <https://github.com/gothinkster/react-redux-realworld-example-app>
- <https://github.com/aneagoie/robofriends-redux>
