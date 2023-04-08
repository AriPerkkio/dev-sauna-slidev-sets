/* Typings */
type TicTacToe<
  InitBoard extends Board,
  NextMove extends Turn | undefined = undefined
> = NextMove extends Turn
  ? Move<InitBoard, NextMove> extends infer NextBoard
    ? NextBoard extends Board
      ? CheckWin<NextBoard, "X"> extends true
        ? "X wins!"
        : CheckWin<NextBoard, "O"> extends true
        ? "O wins!"
        : CheckDraw<NextBoard> extends true
        ? "It's draw!"
        : NextRound<NextBoard> // It's valid move without win or draw
      : NextBoard // It's invalid move, this will be error
    : "Unexpected error #001"
  : InitBoard; // Just initial without move

type NextRound<TODO> = TODO;

type Move<
  CurrentBoard extends Board = Board,
  Move extends Turn = Turn,
  CurrentCell extends Cell = CurrentBoard[Move["row"]][Move["cell"]]
> = CurrentCell extends Empty
  ? ReplaceRow<CurrentBoard, Move>
  : AppendString<"Invalid move, cell used already: ", CurrentCell>;

type ReplaceRow<Rows extends Board, Move extends Turn> = Move["row"] extends 0
  ? [ReplaceCell<Rows[0], Move>, Rows[1], Rows[2]]
  : Move["row"] extends 1
  ? [Rows[0], ReplaceCell<Rows[1], Move>, Rows[2]]
  : [Rows[0], Rows[1], ReplaceCell<Rows[2], Move>];

type ReplaceCell<Cells extends Row, Move extends Turn> = Move["cell"] extends 0
  ? [Move["mark"], Cells[1], Cells[2]]
  : Move["cell"] extends 1
  ? [Cells[0], Move["mark"], Cells[2]]
  : [Cells[0], Cells[1], Move["mark"]];

// prettier-ignore
type CheckWin<CurrentBoard extends Board, Mark> =
  // Horizontal
  CurrentBoard[0][number] extends Mark ? true :
  CurrentBoard[1][number] extends Mark ? true :
  CurrentBoard[2][number] extends Mark ? true :
  // Vertical
  CurrentBoard[number][0] extends Mark ? true :
  CurrentBoard[number][1] extends Mark ? true :
  CurrentBoard[number][2] extends Mark ? true :
  // Diagonal, TODO
  false;

type CheckDraw<CurrentBoard extends Board> = CurrentBoard[Index][Index] extends
  | "X"
  | "O"
  ? true
  : false;

type Empty = " ";
type Cell = "X" | "O" | Empty;
type Row = [Cell, Cell, Cell];
type Board = [Row, Row, Row];
type Index = 0 | 1 | 2;
type Turn = { mark: Exclude<Cell, Empty>; cell: Index; row: Index };

/* Unrelated utility types */
type AppendString<
  Prefix extends string,
  Postfix extends string
> = `${Prefix}${Postfix}`;

/* Implementation */
function makeMove<B extends Board, T extends Turn>(_: B, __: T): Move<B, T> {
  return "" as any;
}
function play(): TicTacToe<
  [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]]
> {
  return "" as any;
}

/* Tests */
function Equals<Expected, Actual extends Expected>(_: Expected, __: Actual) {}

Equals(
  makeMove(
    [
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ],
    { mark: "X", cell: 0, row: 0 }
  ),
  [
    ["X", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ]
);

Equals(
  makeMove(
    [
      ["X", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ],
    { mark: "O", cell: 0, row: 0 }
  ),
  "Invalid move, cell used already: X"
);

type State1 = TicTacToe<[[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]]>;
type State2 = TicTacToe<State1, { mark: "X"; row: 0; cell: 0 }>;
type State3 = TicTacToe<State2, { mark: "O"; row: 1; cell: 0 }>;
type State4 = TicTacToe<State3, { mark: "X"; row: 0; cell: 1 }>;
type State5 = TicTacToe<State4, { mark: "O"; row: 1; cell: 1 }>;
type State6 = TicTacToe<State5, { mark: "X"; row: 0; cell: 2 }>;
Equals<State6, "X wins!">;

Equals<CheckDraw<[["X", "O", "X"], ["O", "O", "X"], ["X", "X", "O"]]>, true>;
Equals<CheckDraw<[[" ", "X", "X"], ["O", "O", "X"], ["O", "X", "O"]]>, false>;
