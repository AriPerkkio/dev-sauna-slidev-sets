/* Typings */
type PathParameters<Path extends string> = CapturePathParameters<Path>;
type QueryParameters<Path extends string> = CaptureQueryParameters<Path>;

type CapturePathParameters<
  Path extends string,
  PreviousParameters extends Record<string, string> | undefined = undefined
> = SplitFromEnd<
  Path,
  "?"
> extends `${infer _PathStart}:${infer ParameterStart}`
  ? ParameterStart extends `${infer Parameter}/${infer PathEnd}`
    ? CapturePathParameters<PathEnd, AddToRecord<PreviousParameters, Parameter>>
    : AddToRecord<PreviousParameters, ParameterStart>
  : PreviousParameters;

type CaptureQueryParameters<
  Path extends string,
  PreviousParameters extends Record<string, string> | undefined = undefined
> = Path extends `${infer _PathStart}?${infer Query}`
  ? CaptureQueryParameters<Query, PreviousParameters>
  : Path extends `${infer QueryParam}=${infer RestQuery}`
  ? CaptureQueryParameters<
      RestQuery,
      AddToRecord<PreviousParameters, SplitFromStart<QueryParam, "&">>
    >
  : PreviousParameters;

/* Utilities */
type AddToRecord<
  Current extends Record<string, string> | undefined,
  Entry extends string
> = Current extends Record<string, string>
  ? Record<Entry | keyof Current, string>
  : Record<Entry, string>;

type SplitFromStart<
  Text extends string,
  Character extends string
> = Text extends `${infer Start}${Character}${infer Trimmed}`
  ? SplitFromStart<Trimmed, Character>
  : Text;

type SplitFromEnd<
  Text extends string,
  Character extends string
> = Text extends `${infer Trimmed}${Character}${infer End}`
  ? SplitFromEnd<Trimmed, Character>
  : Text;

/* Implementation */
function get<Path extends string>(
  path: Path,
  callback: (request: {
    parameters: PathParameters<Path>;
    query: QueryParameters<Path>;
  }) => void
) {}

/* Usage */
get("/api/users/:userId", (request) => {
  request.parameters.userId.toUpperCase();

  // @ts-expect-error -- It's string, not a number
  Math.round(request.parameters.userId);

  // @ts-expect-error -- This does not exist
  request.parameters.clientId;
});

get("/api/users/:userId/accounts/:accountId", (request) => {
  request.parameters.userId.toUpperCase();
  request.parameters.accountId.toUpperCase();

  // @ts-expect-error -- It's string, not a number
  Math.round(request.parameters.userId);

  // @ts-expect-error -- This does not exist
  request.parameters.clientId;
});

get(
  "/api/users/:userId/accounts/:accountId?name=x&limit=y&count=z",
  (request) => {
    request.parameters.userId.toUpperCase();
    request.parameters.accountId.toUpperCase();

    request.query.limit.toUpperCase();
    request.query.name.toUpperCase();
    request.query.count.toUpperCase();
  }
);
