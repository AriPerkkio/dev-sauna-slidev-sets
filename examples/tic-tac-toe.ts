/* Typings */
type TicTacToe<
  MovesOrNextBoard extends Board | Turn[],
  NextRoundsNextMoves extends Turn[] = [],
  PreviousMark extends "X" | "O" | undefined = undefined,
  CurrentBoard extends Board = ResolveBoard<MovesOrNextBoard>,
  Moves extends Turn[] = ResolveNextMoves<MovesOrNextBoard, NextRoundsNextMoves>
> =
  Moves extends [infer NextMove, ...infer NextMoves] ?
    NextMove extends Turn ?
      Move<CurrentBoard, NextMove, PreviousMark> extends infer NextBoard ?
        NextBoard extends Board ?
          CheckWin<NextBoard, "X"> extends true ? "X wins!"
            : CheckWin<NextBoard, "O"> extends true ? "O wins!"
              : CheckDraw<NextBoard> extends true ? "It's draw!"
              // It's valid move without win or draw
              : NextMoves extends Turn[] ?
                TicTacToe<NextBoard, NextMoves, NextMove["mark"]>
                : TicTacToe<NextBoard, [], NextMove["mark"]>
        : NextBoard // It's invalid move, this will be error
      : "Unexpected error #001"
    : "Unexpected error #002"
  : Moves extends [] ? CurrentBoard : "Unexpected error #003"

type ResolveBoard<MovesOrNextBoard extends Board | Turn[]> =
  MovesOrNextBoard extends Board ? MovesOrNextBoard : [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]]

type ResolveNextMoves<MovesOrNextBoard extends Board | Turn[], Moves extends Turn[]> =
  MovesOrNextBoard extends Board ? Moves : MovesOrNextBoard

type Move<
  CurrentBoard extends Board,
  Move extends Turn,
  PreviousMark extends "X" | "O" | undefined = undefined,
  CurrentCell extends Cell = CurrentBoard[Move["row"]][Move["cell"]]
> = PreviousMark extends Move["mark"] ?
  `Invalid move, ${PreviousMark} already run last round`
    : CurrentCell extends Empty
    ? ReplaceRow<CurrentBoard, Move>
  : `Invalid move, Row ${Move["row"]} at cell ${Move["cell"]} already has ${CurrentCell}`

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

type CheckDraw<CurrentBoard extends Board> =
  CurrentBoard[Index][Index] extends "X" | "O"
    ? true
    : false;

type Empty = " ";
type Cell = "X" | "O" | Empty;
type Row = [Cell, Cell, Cell];
type Board = [Row, Row, Row];
type Index = 0 | 1 | 2;
type Turn = { mark: Exclude<Cell, Empty>; cell: Index; row: Index };

/* Unrelated utility types */
type LogInvalidMove<
  Prefix extends string,
  Postfix extends string
> = `${Prefix}${Postfix}`;

/* Tests */
function Equals<Expected, Actual extends Expected>(_: Expected, __: Actual) {}
Equals<"Some text", "Some text">;
// @ts-expect-error
Equals<"Some text", "Some other text">;

Equals<
  Move<
    [
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ],
    { mark: "X", cell: 0, row: 0 },
  >,
  [
    ["X", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ]
>;

Equals<
  Move<
    [
      [" ", " ", " "],
      [" ", " ", "O"],
      [" ", " ", " "],
    ],
    { mark: "O", row: 1, cell: 2 }
  >,
  "Invalid move, Row 1 at cell 2 already has O"
>;

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
Equals<CheckDraw<[["X", "O", "X"], ["O", "O", "X"], ["X", "X", "O"]]>, true>;
Equals<CheckDraw<[[" ", "X", "X"], ["O", "O", "X"], ["O", "X", "O"]]>, false>;

Equals<
  TicTacToe<[
    { mark: "X"; row: 0; cell: 0 },
    { mark: "O"; row: 1; cell: 0 },
    { mark: "X"; row: 0; cell: 1 },
    { mark: "O"; row: 1; cell: 1 },
    { mark: "X"; row: 0; cell: 2 }
  ]>,
  "X wins!"
>;

Equals<
  TicTacToe<[
    { mark: "X"; row: 0; cell: 0 },
  ]>,
  [
    ["X", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "]
  ]
>;


Equals<
  TicTacToe<[
    { mark: "X"; row: 0; cell: 0 },
    { mark: "X"; row: 0; cell: 1 },
  ]>,
  "Invalid move, X already run last round"
>;
