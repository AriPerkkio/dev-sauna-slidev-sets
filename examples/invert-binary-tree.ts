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

type Leaf = {
  id: string;
  left?: Leaf | undefined;
  right?: Leaf | undefined;
};

/* Tests */
type TestTree = CreateLeaf<
  "top",
  CreateLeaf<
    "1-left",
    CreateLeaf<
      "2-left",
      CreateLeaf<"3-left", CreateLeaf<"4-left">, CreateLeaf<"4-right">>,
      CreateLeaf<"3-right">
    >,
    CreateLeaf<"2-right">
  >,
  CreateLeaf<"1-right", CreateLeaf<"2-left">, CreateLeaf<"2-right">>
>;

TreeEquals<
  TestTree,
  {
    id: "top";
    left: {
      id: "1-left";
      left: {
        id: "2-left";
        left: {
          id: "3-left";
          left: "4-left";
          right: "4-right";
        };
        right: "3-right";
      };
      right: "2-right";
    };
    right: {
      id: "1-right";
      left: "2-left";
      right: "2-right";
    };
  }
>;

TreeEquals<
  InvertTree<TestTree>,
  {
    id: "top";
    left: {
      id: "1-right";
      left: "2-right";
      right: "2-left";
    };
    right: {
      id: "1-left";
      left: "2-right";
      right: {
        id: "2-left";
        left: "3-right";
        right: {
          id: "3-left";
          left: "4-right";
          right: "4-left";
        };
      };
    };
  }
>;

function TreeEquals<
  Expected extends Leaf,
  Actual extends ReturnType<typeof DebugTree<Expected>>["out"]
>(_: Expected, __: Actual) {}

/* Debug */
type CreateLeaf<
  Id extends string,
  Left extends Leaf | undefined = undefined,
  Right extends Leaf | undefined = undefined
> = Left extends undefined
  ? Right extends undefined
    ? { id: Id }
    : { id: Id; right: Right }
  : Right extends undefined
  ? { id: Id; left: Left }
  : { id: Id; left: Left; right: Right };

function DebugTree<Tree extends Leaf>(): {
  out: Tree["left"] extends Leaf
    ? Tree["right"] extends Leaf
      ? {
          id: Tree["id"];
          left: ReturnType<typeof DebugTree<Tree["left"]>>["out"];
          right: ReturnType<typeof DebugTree<Tree["right"]>>["out"];
        }
      : Tree["id"]
    : Tree["id"];
} {
  return 0 as any;
}

export {};
