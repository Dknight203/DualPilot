
/**
 * Builds the DualPilot tracking snippet.
 * @param siteId The unique identifier for the site.
 * @param token The verification token for the site's CMS connection.
 * @returns The full HTML script tag as a string.
 */
export const buildDualPilotSnippet = (siteId: string, token: string): string => {
  return `<script>
(function () {
  var siteId = "${siteId}";
  var token = "${token}";
  var endpoint = "https://cuuzvvgrriyhvilfcyaa.supabase.co/functions/v1/verify-snippet";

  try {
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId: siteId, token: token })
    });
  } catch (e) {
    console.error("DualPilot snippet error", e);
  }
})();
</script>`;
};
