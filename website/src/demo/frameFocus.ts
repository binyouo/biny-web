/** Keep Desktop's programmatic focus inside the embedded preview from scrolling its host page. */
export function containFrameFocus(element: typeof HTMLElement): () => void {
  const focus = element.prototype.focus;
  const contained: typeof focus = function (this: HTMLElement, options) { focus.call(this, { ...options, preventScroll: true }); };
  element.prototype.focus = contained;
  return () => { if (element.prototype.focus === contained) element.prototype.focus = focus; };
}
