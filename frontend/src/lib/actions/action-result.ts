/**
 * Server Actions return a serializable result instead of throwing, because
 * thrown errors are masked in production builds.
 */
export type FieldErrors = Partial<Record<string, string[]>>;

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: FieldErrors };

export class ActionError extends Error {
  readonly fieldErrors?: FieldErrors;

  constructor(message: string, fieldErrors?: FieldErrors) {
    super(message);
    this.name = "ActionError";
    this.fieldErrors = fieldErrors;
  }
}

/** Client helper: turns a failed ActionResult into a thrown error for TanStack mutations. */
export async function unwrapAction<T>(result: Promise<ActionResult<T>>): Promise<T> {
  const resolved = await result;
  if (!resolved.ok) throw new ActionError(resolved.error, resolved.fieldErrors);
  return resolved.data;
}
