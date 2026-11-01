/**
 * Microsoft Clarity, rendered in the root <head> only when VITE_CLARITY_ID is set at
 * build time (Netlify: Site configuration > Environment variables). Unset = no tag.
 */
const RAW_CLARITY_ID = (import.meta.env.VITE_CLARITY_ID as string | undefined)?.trim() ?? "";
export const CLARITY_ID = /^[a-z0-9]{6,20}$/i.test(RAW_CLARITY_ID) ? RAW_CLARITY_ID : "";

export function ClarityTag() {
  if (!CLARITY_ID) return null;
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`,
      }}
    />
  );
}
