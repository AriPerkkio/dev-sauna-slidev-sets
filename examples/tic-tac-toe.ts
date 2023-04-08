/* Typings */
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

type Empty = " ";
type ValidMark = "X" | "O"
type Cell = ValidMark | Empty;
type Row = [Cell, Cell, Cell];
type Board = [Row, Row, Row];
type Index = 0 | 1 | 2;
type Turn = { mark: Exclude<Cell, Empty>; cell: Index; row: Index };

type Move<
  CurrentBoard extends Board,
  Move extends Turn,
  PreviousMark extends ValidMark | undefined = undefined,
  CurrentCell extends Cell = CurrentBoard[Move["row"]][Move["cell"]]
> = PreviousMark extends Move["mark"] ?
  `Invalid move, ${PreviousMark} already run last round`
    : CurrentCell extends Empty
    ? ReplaceRow<CurrentBoard, Move>
  : `Invalid move, Row ${Move["row"]} at cell ${Move["cell"]} already has ${CurrentCell}`

type ReplaceRow<Rows extends Board, Move extends Turn> =
  Move["row"] extends 0
  ? [ReplaceCell<Rows[0], Move>, Rows[1], Rows[2]]
  : Move["row"] extends 1
  ? [Rows[0], ReplaceCell<Rows[1], Move>, Rows[2]]
  : [Rows[0], Rows[1], ReplaceCell<Rows[2], Move>];

type ReplaceCell<Cells extends Row, Move extends Turn> =
  Move["cell"] extends 0
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
  // Diagonal
    CurrentBoard[0][0] extends CurrentBoard[1][1] ? CurrentBoard[2][2] extends Mark ? true :
    CurrentBoard[0][2] extends CurrentBoard[1][1] ? CurrentBoard[2][0] extends Mark ? true :
    false : false :
  false;

type CheckDraw<CurrentBoard extends Board> =
  CurrentBoard[number][number] extends "X" | "O"
    ? true
    : false;

/* Argument parsing */
type ResolveBoardFromArgs<MovesOrNextBoard extends Board | Turn[]> =
  MovesOrNextBoard extends Board ? MovesOrNextBoard : [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]]

type ResolveNextMovesFromArgs<MovesOrNextBoard extends Board | Turn[], Moves extends Turn[]> =
  MovesOrNextBoard extends Board ? Moves : MovesOrNextBoard

// Unexpecter error, meaning that Typescript required a check that should not fail in practice, e.g. to narrow a type
type UnexpectedError<Id extends number> = `Unexpected error #${Id}`;

/* Tests */
function Equals<Expected, Actual extends Expected>(_: Expected, __: Actual) {}
Equals<"Some text", "Some text">;
// @ts-expect-error
Equals<"Some text", "Some other text">;

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
    { mark: "X"; row: 0; cell: 0 },
    { mark: "X"; row: 0; cell: 1 },
  ]>,
  "Invalid move, X already run last round"
>;

Equals<
  TicTacToe<[
    { mark: "X"; row: 1; cell: 1 },
    { mark: "O"; row: 1; cell: 1 },
  ]>,
  'Invalid move, Row 1 at cell 1 already has X'
>;

// Horizontal
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
// Vertical
Equals<
  TicTacToe<[
    { mark: "O"; row: 0; cell: 0 },
    { mark: "X"; row: 0; cell: 1 },
    { mark: "O"; row: 1; cell: 0 },
    { mark: "X"; row: 0; cell: 2 },
    { mark: "O"; row: 2; cell: 0 },
  ]>,
  "O wins!"
>;
// Diagonal
Equals<
  TicTacToe<[
    { mark: "X"; row: 0; cell: 0 },
    { mark: "O"; row: 1; cell: 0 },
    { mark: "X"; row: 1; cell: 1 },
    { mark: "O"; row: 2; cell: 0 },
    { mark: "X"; row: 2; cell: 2 },
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
