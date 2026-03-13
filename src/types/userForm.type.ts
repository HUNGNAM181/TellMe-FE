import type { CreateUserPayload, UpdateUserPayload } from "./user.types";

export type UserFormValues = Partial<CreateUserPayload & UpdateUserPayload>;
