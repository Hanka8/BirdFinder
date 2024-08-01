- CORS policy on APIs

## takeaways

### double rendering
- React's Strict Mode can cause components to render twice in development mode to help identify side effects
- Purpose: Strict Mode helps catch side effects by intentionally invoking components and lifecycle methods (like useEffect) twice. This allows developers to identify components that have unintended side effects or depend on outdated state, which can be problematic if they aren't idempotent (i.e., they produce the same result no matter how many times they're run)

### asynchronous browsers apis
- The navigator.geolocation.getCurrentPosition method is asynchronous, which means that it doesn't block the execution of the rest of your code while it waits for the geolocation request to complete. Instead, it schedules the callback functions (success and error) to be executed once the location data is available or an error occurs.
