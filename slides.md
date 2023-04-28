# Typescript Type System

<div class="mt-20 flex">
  <ul v-click class="flex-1">
    <li>No JavaScript</li>
    <li>No runtime code</li>
  </ul>

  <ul v-click class="flex-1">
    <li>Real world use cases</li>
    <li>Meta typing</li>
  </ul>
</div>

---

## Basic types 1/3

<div class="mt-20"></div>

```ts {1-3|all}
const count: number = 1;
const userName: string = "John Doe";
const isAdmin: boolean = true;

const fruit: string[] = ["apples", "oranges"];
const person: { name: string, age: number } = { name: "John Doe", age: 100 };
```

<v-click>

```ts {monaco}




const count: number = "John Doe";
const userName: string = 1;
```

</v-click>

---

## Basic types 2/3

<div class="mt-10 flex">
  <div class="flex-1">

```ts
const email: null | string = "test@test.com"
const missingEmail: null | string = null
```

<v-click>

```ts
type Email = null | string

const email: Email = "test@test.com"
const missingEmail: Email = null
```

</v-click>
  </div>

  <div class="flex-1 pl-1rem">

<div v-click>

```ts
type Currency = "EUR" | "GBP" | "USD"
const accountUnit: Currency = "EUR";
```

</div>

<div v-click>

```ts {monaco}
type EuropeanCurrency = "EUR" | "GBP" | "SEK"
type NorthAmericanCurrency = "USD" | "CAD"

type Currency = EuropeanCurrency | NorthAmericanCurrency
```

</div>

  </div>
</div>


---

## Basic types 3/3

<div class="mt-10 flex">
  <div class="flex-1">

```ts {monaco}
interface User {
  id: number
  name: string
  email: string
}

const admin: User = {
  id: 1001,
  name: "root",
  email: "admin@example.com"
};
```
  </div>

  <div class="flex-1 pl-1rem">

  <div v-click>

```ts
type GenericType<T> = { id: T }

const textExample: GenericType<string> = { id: 'A' }
const numberExample: GenericType<number> = { id: 1 }
```

  </div>

<Arrow v-click x1="740" y1="170" x2="640" y2="140" color="red" />
<Arrow v-after x1="850" y1="170" x2="720" y2="140" color="red" />


  <div v-click>

```ts {monaco}
interface User<ID extends string | number = string> {
  id: ID
  name: string
}

const user1: User<string> = { id: 'A', name: 'Tester' }
const user2: User<number> = { id: 101, name: 'Tester' }
const user3: User = { id: 'B', name: 'Tester' }
```

  </div>
  </div>
</div>

---

## Advanced types - inference - extends

<div class="mt-10 flex">
  <div class="flex-1">

```ts {monaco}
type IsTrue<Input> =
  Input extends true ?
    "Yes it's true!" :
    "Nope, not true"

type TestA = IsTrue<true>
type TestB = IsTrue<false>
```

  <div v-click class="mt-10">

```ts {monaco}
import { Equals } from "example-types";

Equals<true, false>;
Equals<"Hello world", "Hello world">;
Equals<"One", "Two">;
```

  </div>

  </div>

  <div v-click class="flex-1 pl-1rem">

```ts {monaco}
import { Equals } from "example-types";

type IsTrue<Input> =
  Input extends true ?
    "Yes it's true!" :
    "Nope, not true";

Equals<
  IsTrue<true>,
  "Yes it's true!"
>;


Equals<
  IsTrue<false>,
  "Yes it's true!"
>;
```

  </div>
</div>

---

## Advanced types - string inference

<div class="mt-10 flex">
  <div class="flex-1">

```ts {monaco}
import { Equals } from "example-types";

type SecondWord<Text> =
  Text extends `${infer First} ${infer Second}` ?
    Second :
    "Please input string with two words"

Equals<
  SecondWord<123>,
  "???"
>;
Equals<
  SecondWord<"Hello?">,
  "Please input string with two words"
>;
Equals<
  SecondWord<"Hello world">,
  "world"
>;
```

  </div>

  <Arrow v-click x1="190" y1="345" x2="282" y2="198" color="red" />


  <div v-click class="flex-1 pl-1rem">

```ts {monaco}
import { Equals } from "example-types";

type Greeting<Text> =
  Text extends `Hello, I am ${infer Name}` ?
    `Hello there ${Name}! I am Typed Greeting!` :
    "Please state your name as 'Hello, I am <your name>'."

Equals<
  Greeting<"Hello?">,
  "Please state your name as 'Hello, I am <your name>'."
>;

Equals<
  Greeting<"Hello, I am John Doe">,
  "Hello there John Doe! I am Typed Greeting!"
>;
```

  </div>
</div>


---

## Advanced types - recursive

```ts {monaco}
import { Equals } from "example-types"

type PickNumbers<
  List extends unknown[],
  PreviousNumbers extends number[] = number[]
> =
  List extends [infer First, ...infer Rest] ?
    First extends number ?
      PickNumbers<Rest, [...PreviousNumbers, First]> :
      PickNumbers<Rest, PreviousNumbers>
  : PreviousNumbers;

Equals<
  PickNumbers<["A", 1, "C", 4, 5, "E"]>,
  [1, 4, 5,]
>;

Equals<
  PickNumbers<["A", 1, "C", 4, 5, "E"]>,
  [5, 1, 4]
>;
```

---

## Real world example - Endpoint URL parsing 1/2

<div class="mt-10"></div>

> GET /api/users/123
>
> \> { name: "John Doe", id: 123, email: ... }



<div class="mt-10 flex">
  <div class="flex-1">

```ts {monaco}
import { rest } from "example-types";

rest.get("/api/users/:userId", (request) => {
  // OK - it's a string
  request.parameters.userId.toUpperCase();

  // Error - it's not a number
  Math.round(request.parameters.userId);

  // Error - no such parameter
  request.parameters.clientId;
});
```

  </div>

  <div class="flex-1 pl-1rem">

```ts {monaco}
import { AddToRecord, Equals } from "example-types";

type CapturePathParameters<
  Path extends string,
  PreviousParameters extends Record<string, string> | undefined = undefined
> =
  Path extends `${infer _PathStart}:${infer ParameterStart}`
  ? ParameterStart extends `${infer Parameter}/${infer PathEnd}`
    ? CapturePathParameters<PathEnd, AddToRecord<PreviousParameters, Parameter>>
    : AddToRecord<PreviousParameters, ParameterStart>
  : PreviousParameters;

Equals<
  CapturePathParameters<"/api/users/:userId">,
  { userId:  string }
>;
```

  </div>
</div>

---

## Real world example - Endpoint URL parsing 2/2

<div class="mt-5 flex"></div>

```ts {monaco}
import { rest, AddToRecord, Equals, SplitFromStart } from "example-types";

rest.get("/api/users/:userId/accounts/:accountId?name=x&limit=y&count=z", (request) => {
  request.parameters.userId.toUpperCase();
  request.query.limit.toUpperCase();

  Equals<typeof request.parameters, { userId: string, accountId: string}>;
  Equals<typeof request.query, { name: string, limit: string, count: string}>;
});


type CaptureQueryParameters<
  Path extends string,
  PreviousParameters extends Record<string, string> | undefined = undefined
> = Path extends `${infer _PathStart}?${infer Query}`
  ? CaptureQueryParameters<Query, PreviousParameters>
  : Path extends `${infer QueryParam}=${infer RestQuery}`
  ? CaptureQueryParameters<RestQuery, AddToRecord<PreviousParameters, SplitFromStart<QueryParam, "&">>>
  : PreviousParameters;

Equals<
  CaptureQueryParameters<"/api/users?name=x&limit=n">,
  { name: string; limit: string }
>;
```

---

### Meta typing - Invert Binary Tree - 1/9

<div class="mt-10"></div>

```ts
//      1         >>        1
//    /   \       >>      /   \
//   2     3      >>     3     2
//  / \   / \     >>    / \   / \
// 4  5  6   7    >>   5  4  7   6

type InvertTree<Tree extends Leaf> = Tree extends {
  left: infer Left;
  right: infer Right;
}
  ? Left extends Leaf
    ? Right extends Leaf
      ? { left: InvertTree<Right>; right: InvertTree<Left>; id: Tree["id"] }
      : { left: undefined; right: InvertTree<Left>; id: Tree["id"] } // There is left but no right
    : Right extends Leaf
    ? { left: InvertTree<Right>; right: undefined; id: Tree["id"] } // There is right but no left
    : Tree
  : Tree; // There is no left or right
```

<div class="mt-10"></div>

<a href="https://gist.github.com/AriPerkkio/a9648aa25647ea30fba0790b285942bb">
  invert-binary-tree.ts - gist.github.com/AriPerkkio
</a>

---
layout: iframe-right
url: https://tic-tac-toe.cloudamite.com/
---

### Meta typing - Tic-Tac-Toe - 2/9

<div class="mt-10"></div>

```ts {monaco}
import { DebugBoard, TicTacToe } from "example-types";

DebugBoard<
  TicTacToe<[
    //{ mark: "X"; row: 0; cell: 0 },
    //{ mark: "O"; row: 1; cell: 0 },
    //{ mark: "X"; row: 1; cell: 1 },
    //{ mark: "O"; row: 2; cell: 0 },
    //{ mark: "X"; row: 2; cell: 2 },
  ]>
>()




.hoverForDebug;
```

<div class="mt-20"></div>

<a href="https://gist.github.com/AriPerkkio/52db9d65506e7eca4bf3d3ecb0d0084c">
  tic-tac-toe.ts - gist.github.com/AriPerkkio
</a>

---

### Meta typing - Tic-Tac-Toe - 3/9

```ts {all|12-14|15-17|all}
type TicTacToe<
  MovesOrNextBoard extends Board | Turn[], // On initial round this will be a Turn[], on next rounds it will be a Board with some moves done
  MovesOrMissing extends Turn[] = [], // On initial round this will be empty, on next rounds it will be the moves
  PreviousMark extends ValidMark | undefined = undefined, // On initial round this will be missing, on next rounds it will be the mark of the last move
  CurrentBoard extends Board = ResolveBoardFromArgs<MovesOrNextBoard>, // Parsed argument
  Moves extends Turn[] = ResolveNextMovesFromArgs<MovesOrNextBoard, MovesOrMissing> // Parsed argument
> =
  Moves extends [infer NextMove, ...infer NextMoves] ?
    NextMove extends Turn ?
      Move<CurrentBoard, NextMove, PreviousMark> extends infer NextBoard ?
        NextBoard extends Board ?
          CheckWin<NextBoard, "X"> extends true ? "X wins!"
            : CheckWin<NextBoard, "O"> extends true ? "O wins!"
              : CheckDraw<NextBoard> extends true ? "It's a draw!"
              // It's valid move without win or draw
              : NextMoves extends Turn[] ?
                TicTacToe<NextBoard, NextMoves, NextMove["mark"]> // Recursive for next round
                : TicTacToe<NextBoard, [], NextMove["mark"]> // No moves left
        : NextBoard // It's invalid move, this will be error set by Move<>
      : UnexpectedError<1>
    : UnexpectedError<2>
  : Moves extends [] ? CurrentBoard // Initial or the last round where no moves were passed
  : UnexpectedError<3>
```

<a href="https://gist.github.com/AriPerkkio/52db9d65506e7eca4bf3d3ecb0d0084c">
  tic-tac-toe.ts - gist.github.com/AriPerkkio
</a>

---

### Meta typing - Tic-Tac-Toe - 4/9

<div class="flex">
  <div class="flex-1">

```ts {monaco}
import { Equals, TicTacToe } from "example-types";

Equals<
  TicTacToe<[
    { mark: "X"; row: 1; cell: 1 },
    { mark: "O"; row: 2; cell: 0 },
  ]>,
  [
    [" ", " ", " "],
    [" ", "X", " "],
    ["O", " ", " "]
  ]
>;
Equals<
  TicTacToe<[
    { mark: "X"; row: 1; cell: 1 },
    { mark: "O"; row: 1; cell: 1 },
  ]>,
  'Invalid move, Row 1 at cell 1 already has X'
>;
```

  </div>

  <div class="flex-1 pl-1rem">

```ts {monaco}
import { Equals, TicTacToe } from "example-types";

Equals<
  TicTacToe<[
    { mark: "X"; row: 0; cell: 0 },
    { mark: "O"; row: 1; cell: 0 },
    { mark: "X"; row: 0; cell: 1 },
    { mark: "O"; row: 1; cell: 1 },
    { mark: "X"; row: 0; cell: 2 },
  ]>,
  "X wins!"
>;
Equals<
  TicTacToe<[
    { mark: "X"; row: 0; cell: 0 },
    { mark: "O"; row: 0; cell: 1 },
    { mark: "X"; row: 0; cell: 2 },
    { mark: "O"; row: 1; cell: 1 },
    { mark: "X"; row: 1; cell: 0 },
    { mark: "O"; row: 1; cell: 2 },
    { mark: "X"; row: 2; cell: 1 },
    { mark: "O"; row: 2; cell: 0 },
    { mark: "X"; row: 2; cell: 2 },
  ]>,
  "It's a draw!"
>;
```

  </div>
</div>

---

### Meta typing - 5/9

<div class="mt-10"></div>

> A compile-time 4-Bit Virtual Machine implemented in TypeScript's type system. Capable of running a sample 'FizzBuzz' program.
>
> Syntax emits zero JavaScript.

<div class="mt-10"></div>

<a href="https://gist.github.com/acutmore/9d2ce837f019608f26ff54e0b1c23d6e">
  Emulating a 4-Bit Virtual Machine in (TypeScript\JavaScript) (just Types no Script)
</a>

---
layout: iframe-right
url: https://ricklove.me/typescript-type-system-adventure
---

### Meta typing - 6/9

<div class="mt-10"></div>

> https://ricklove.me/typescript-type-system-adventure

---
layout: iframe-right
url: https://www.richard-towers.com/2023/03/11/typescripting-the-technical-interview.html
---

### Meta typing - 7/9

<div class="mt-10"></div>

> https://www.richard-towers.com/2023/03/11/typescripting-the-technical-interview.html

---
layout: iframe-right
url: https://kysely-org.github.io/kysely/
---

### Meta typing - 8/9

<div class="mt-5"></div>

> https://kysely-org.github.io/kysely/

---
layout: iframe-right
url: https://tsch.js.org/
---

### Meta typing - 9/9

<div class="mt-5"></div>

> https://tsch.js.org/

<div class="mt-5"></div>

> ##### Tuple to Object (easy)
>
> Given an array, transform it into an object type and the key/value must be in the provided array.
>
> For example:
>
> ```ts
> const tuple = [
>     'tesla',
>     'model 3',
>     'model X',
>     'model Y'
>  ] as const
>
> type result = TupleToObject<typeof tuple>
> // expected {
> //   'tesla': 'tesla',
> //   'model 3': 'model 3',
> //   'model X': 'model X',
> //   'model Y': 'model Y'
> // }
> ```
