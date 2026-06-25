export const HTTP_STATUS = {
  // 2** = Success
  OK:         200, // Request worked. Used for GET, PATCH, DELETE.
  CREATED:    201, // A new resource was created. Used for POST (register, create listing).
  NO_CONTENT: 204, // Success but nothing to send back. Used for logout, delete.
 
  // 4** = Client made a mistake
  BAD_REQUEST:  400, // The request body is invalid (failed validation).
  UNAUTHORIZED: 401, // User is not logged in (no token or expired token).
  FORBIDDEN:    403, // User is logged in but not allowed to do this (not the owner, not admin).
  NOT_FOUND:    404, // The resource does not exist (wrong ID, wrong email).
  CONFLICT:     409, // Duplicate data (email already registered, portfolio role already exists).
  TOO_MANY:     429, // User is making too many requests (rate limit exceeded).
 
  // 5xx = Server made a mistake
  INTERNAL: 500, // Something unexpected crashed on the server.
} as const;
