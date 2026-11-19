/**
 * Copies text to the clipboard and reports whether it worked.
 *
 * It tries the modern clipboard API first. That one refuses when the page is not focused
 * or the context is not secure, so it then falls back to selecting hidden text and using
 * the older copy command, which still works in those cases.
 */
export async function writeToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fall through to the legacy approach below.
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  // Inside an open modal dialog only the dialog's own content can be selected, so the
  // hidden text goes there when one is open.
  (document.querySelector("dialog[open]") ?? document.body).appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
}
