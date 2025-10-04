type LogoutHandler = () => void;

let handler: LogoutHandler;

export function setHandler(logoutHandler: LogoutHandler): void {
  handler = logoutHandler;
}

async function fetchClient(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  try {
    const response = await fetch(input, init);

    if (response.status === 401) {
      console.warn(
        "Authentication failed (401 Unauthorized). Logging out user."
      );
      handler?.();

      return Promise.reject(
        new Error("Unauthorized. User has been logged out.")
      );
    }

    return response;
  } catch (error) {
    console.error("Network error:", error);
    return Promise.reject(error);
  }
}

export default fetchClient;
