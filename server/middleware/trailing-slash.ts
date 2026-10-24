/**
 * Permanent (301) redirect for trailing-slash URLs: /about/ -> /about.
 * Without this the router answered with a 307 (temporary), which tells search
 * engines the slash URL may come back. The homepage "/" is left alone, and the
 * query string is preserved.
 */
interface TrailingSlashEvent {
  url: URL;
}

export default (event: TrailingSlashEvent) => {
  const { pathname, search } = event.url;
  if (pathname.length > 1 && pathname.endsWith("/")) {
    const target = (pathname.replace(/\/+$/, "") || "/") + search;
    return new Response(null, { status: 301, headers: { location: target } });
  }
};
