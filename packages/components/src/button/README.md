# Button

`uds-button` is the action control. `variant` is emphasis and `tone` is meaning. Colors, size and spacing are the public custom properties `--uds-button-*`. `variant="custom"` does not apply a color recipe; the consumer sets those properties and owns the contrast.

The inner control is a native `<button>`. `type="submit"` and `type="reset"` use `ElementInternals` on the light-DOM form. `disabled` is not focusable. `loading` stays focusable, sets `aria-busy`, and ignores activation. The target size never goes below 24 CSS pixels.

An icon-only button must set `ariaLabel`. In development a missing name logs a warning.
