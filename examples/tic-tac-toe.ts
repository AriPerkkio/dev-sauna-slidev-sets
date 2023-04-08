/* Typings */
type TicTacToe = any;
type Move<
  CurrentBoard extends Board,
  Move extends Turn,
  CurrentCell extends Cell = CurrentBoard[Move["row"]][Move["cell"]]
> = CurrentCell extends Empty ? "OK" : "Not allwed, cell not empty";

type ReplaceRow<
  Rows extends Board,
  Move extends Turn,
  RowIndex extends Move["row"] = Move["row"]
> = ReplaceCell<Rows[RowIndex], Move>;

type ReplaceCell<
  Cells extends Row,
  Move extends Turn,
  CellIndex extends Move["cell"] = Move["cell"],
  Mark = Move["mark"]
> = Cells[CellIndex] extends Empty
  ? Cells extends [infer First, infer Second, infer Third]
    ? CellIndex extends 0
      ? [Mark, Second, Third]
      : CellIndex extends 1
      ? [First, Mark, Third]
      : CellIndex extends 2
      ? [First, Second, Mark]
      : never
    : never
  : "Not allwed, cell not empty";

type CellTest = ReplaceCell<[" ", " ", " "], { mark: "X"; cell: 0; row: 0 }>;
type CellTest2 = ReplaceCell<[" ", " ", " "], { mark: "X"; cell: 1; row: 0 }>;
type CellTest3 = ReplaceCell<[" ", " ", " "], { mark: "X"; cell: 2; row: 0 }>;
type CellTest4 = ReplaceCell<[" ", "O", " "], { mark: "X"; cell: 1; row: 0 }>;

type Empty = " ";
type Cell = "X" | "O" | Empty;
type Row = [Cell, Cell, Cell];
type Board = [Row, Row, Row];
type Index = 0 | 1 | 2;
type Turn = { mark: Exclude<Cell, Empty>; cell: Index; row: Index };

/* Implementation */
function play<B extends Board, T extends Turn>(_: B, __: T): Move<B, T> {
  return "" as any;
}

/* Tests */
function Test<Expected, Actual extends Expected>(_: Expected, __: Actual) {}

Test(
  play(
    [
      [" ", "O", "X"],
      ["O", " ", "O"],
      ["X", "O", "X"],
    ],
    { mark: "X", cell: 0, row: 0 }
  ),
  "OK"
);

Test(
  play(
    [
      [" ", "O", "X"],
      ["O", " ", "O"],
      ["X", "O", "X"],
    ],
    { mark: "X", cell: 0, row: 0 }
  ),
  "OK"
);

Test(
  play(
    [
      [" ", "O", "X"],
      ["O", " ", "O"],
      ["X", "O", "X"],
    ],
    { mark: "X", cell: 2, row: 2 }
  ),
  "Not allwed, cell not empty"
);
