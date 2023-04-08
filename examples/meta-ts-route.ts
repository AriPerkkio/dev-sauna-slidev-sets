/* Typings */
type PathParameters<Path extends string> = CaptureParameter<Path>;

type CaptureParameter<
  Path extends string,
  PreviousParameters extends Record<never, string> = Record<never, string>
> = Path extends `${infer _PathStart}:${infer ParameterEnd}`
  ? ParameterEnd extends `${infer Parameter}/${infer PathEnd}`
    ? CaptureParameter<PathEnd, AddToRecord<PreviousParameters, Parameter>>
    : AddToRecord<PreviousParameters, ParameterEnd>
  : PreviousParameters;

/* Utilities */
type AddToRecord<
  Current extends Record<string, string>,
  Entry extends string
> = Current & Record<Entry, string>;

/* Implementation */
function get<Path extends string>(
  path: Path,
  callback: (request: { parameters: PathParameters<Path> }) => void
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
