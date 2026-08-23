import { NextRequest, NextResponse } from "next/server";

export interface EntityLabels {
  /** Lowercase singular name, e.g. "tour", "FAQ item". */
  singular: string;
  /** Lowercase plural name, e.g. "tours", "FAQ items". */
  plural: string;
}

export interface RequiredFields {
  /** Fields that must be present and truthy. */
  present?: string[];
  /** Fields that must be present and of type number. */
  numbers?: string[];
}

export interface ListQueryFlag {
  /** Query string parameter that toggles the filtered listing. */
  param: string;
  /** Value used when the parameter is absent from the request. */
  defaultWhenAbsent?: boolean;
}

export type RequestBody = Record<string, unknown>;

export function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

interface Action {
  gerund: string;
  verb: string;
}

const FETCH: Action = { gerund: "fetching", verb: "fetch" };
const CREATE: Action = { gerund: "creating", verb: "create" };
const UPDATE: Action = { gerund: "updating", verb: "update" };
const DELETE_: Action = { gerund: "deleting", verb: "delete" };

async function run(
  action: Action,
  name: string,
  handler: () => Promise<NextResponse>
) {
  try {
    return await handler();
  } catch (error) {
    console.error(`Error ${action.gerund} ${name}:`, error);
    return apiError(`Failed to ${action.verb} ${name}`, 500);
  }
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function readFlag(request: NextRequest, flag: ListQueryFlag) {
  const raw = request.nextUrl.searchParams.get(flag.param);
  if (raw === null) return flag.defaultWhenAbsent ?? false;
  return raw === "true";
}

function missingFields(body: RequestBody, required?: RequiredFields) {
  const presentMissing = (required?.present ?? []).some((field) => !body[field]);
  const numbersMissing = (required?.numbers ?? []).some(
    (field) => typeof body[field] !== "number"
  );
  return presentMissing || numbersMissing;
}

export interface CollectionRouteConfig<T, TInput> {
  labels: EntityLabels;
  list: (filtered: boolean) => Promise<T[]>;
  create: (data: TInput) => Promise<string>;
  requiredFields?: RequiredFields;
  listQuery?: ListQueryFlag;
}

/**
 * Builds the GET/POST handlers of a collection route (`/api/<entity>`).
 */
export function createCollectionRoute<T, TInput>(
  config: CollectionRouteConfig<T, TInput>
) {
  const { labels, list, create, requiredFields, listQuery } = config;

  return {
    GET: (request: NextRequest) =>
      run(FETCH, labels.plural, async () => {
        const filtered = listQuery ? readFlag(request, listQuery) : false;
        return NextResponse.json(await list(filtered));
      }),

    POST: (request: NextRequest) =>
      run(CREATE, labels.singular, async () => {
        const body = (await request.json()) as RequestBody;
        if (missingFields(body, requiredFields)) {
          return apiError("Missing required fields", 400);
        }
        const id = await create(body as TInput);
        return NextResponse.json(
          { id, message: `${capitalize(labels.singular)} created successfully` },
          { status: 201 }
        );
      }),
  };
}

export interface ItemRouteConfig<T> {
  labels: EntityLabels;
  update: (id: string, data: Partial<T>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  read: (id: string) => Promise<T | null>;
}

interface RouteParams {
  params: { id: string };
}

/**
 * Builds the GET/PUT/DELETE handlers of an item route (`/api/<entity>/[id]`).
 * A route file exports only the handlers its endpoint supports.
 */
export function createItemRoute<T>(config: ItemRouteConfig<T>) {
  const { labels, update, remove, read } = config;

  return {
    PUT: (request: NextRequest, { params }: RouteParams) =>
      run(UPDATE, labels.singular, async () => {
        const body = (await request.json()) as RequestBody;
        await update(params.id, body as Partial<T>);
        return NextResponse.json({
          message: `${capitalize(labels.singular)} updated successfully`,
        });
      }),

    DELETE: (_request: NextRequest, { params }: RouteParams) =>
      run(DELETE_, labels.singular, async () => {
        await remove(params.id);
        return NextResponse.json({
          message: `${capitalize(labels.singular)} deleted successfully`,
        });
      }),

    GET: (_request: NextRequest, { params }: RouteParams) =>
      run(FETCH, labels.singular, async () => {
        const item = await read(params.id);
        if (!item) {
          return apiError(`${capitalize(labels.singular)} not found`, 404);
        }
        return NextResponse.json(item);
      }),
  };
}
