/** Attach the web substitute for Electron's browser surface to its actual layout slot.
 * A fixed overlay drifts when the client's sidebar or inspector animates. */
export function placeBrowserSurface(frame: HTMLIFrameElement, document: Document, visible: boolean): void {
  const slot = visible ? document.querySelector<HTMLElement>(".inspector-browser-slot") : null;
  frame.hidden = !slot;
  if (slot && frame.parentElement !== slot) slot.append(frame);
}
