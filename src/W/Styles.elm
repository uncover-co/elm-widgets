module W.Styles exposing (baseTheme, globalStyles)

{-|

@docs globalStyles

-}

import Html as H
import Theme


{-| -}
baseTheme : H.Html msg
baseTheme =
    Theme.globalProvider Theme.lightTheme


{-| -}
globalStyles : H.Html msg
globalStyles =
    H.node "style"
        []
        [ H.text """*, ::before, ::after {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
}

::backdrop {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
}

.ew-btn {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding-top: 0px;
  padding-bottom: 0px;
  font-family: var(--theme-font-text);
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.05em;
  text-decoration-line: none;
}

.ew-btn-like {
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
  text-decoration-line: none;
  box-sizing: border-box;
  border-radius: 0.5rem;
  border-width: 0px;
}

.ew-check-radio {
  margin: 0px;
  height: 1.75rem;
  width: 1.75rem;
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
  border-width: 2px;
  border-style: solid;
  border-color: rgb(var(--theme-base-aux-ch) / 0.3);
  --tw-bg-opacity: 1;
  background-color: rgb(var(--theme-base-bg-ch) / var(--tw-bg-opacity));
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  display: grid;
  place-content: center;
  outline-width: 0px;
  --tw-ring-color: rgb(var(--theme-primary-fg-ch) / 0.5);
  --tw-ring-offset-width: 0px;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.ew-check-radio::before {
  display: block;
  --tw-content: "";
  height: 1rem;
  width: 1rem;
  background-color: currentColor;
  --tw-scale-x: 0;
  --tw-scale-y: 0;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  content: var(--tw-content);
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

.ew-check-radio:hover {
  opacity: 0.9;
}

.ew-check-radio:active {
  opacity: 0.75;
}

.ew-check-radio:checked {
  --tw-bg-opacity: 1;
  background-color: rgb(var(--theme-base-bg-ch) / var(--tw-bg-opacity));
}

.ew-check-radio:focus {
  --tw-border-opacity: 1;
  border-color: rgb(var(--theme-primary-fg-ch) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: rgb(var(--theme-base-bg-ch) / var(--tw-bg-opacity));
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.ew-check-radio:checked::before {
  content: var(--tw-content);
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.ew-check-radio:disabled {
  background-color: rgb(var(--theme-base-aux-ch) / 0.25);
}

.ew-pointer-events-none {
  pointer-events: none;
}

.ew-visible {
  visibility: visible;
}

.ew-fixed {
  position: fixed;
}

.ew-absolute {
  position: absolute;
}

.ew-relative {
  position: relative;
}

.ew-inset-0 {
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}

.ew-inset-1 {
  top: 0.25rem;
  right: 0.25rem;
  bottom: 0.25rem;
  left: 0.25rem;
}

.ew-inset-y-0 {
  top: 0px;
  bottom: 0px;
}

.ew-inset-x-\\[12px\\] {
  left: 12px;
  right: 12px;
}

.ew-inset-x-0 {
  left: 0px;
  right: 0px;
}

.ew-inset-x-2 {
  left: 0.5rem;
  right: 0.5rem;
}

.ew-inset-y-1 {
  top: 0.25rem;
  bottom: 0.25rem;
}

.ew-inset-x-1 {
  left: 0.25rem;
  right: 0.25rem;
}

.ew-bottom-full {
  bottom: 100%;
}

.ew-left-full {
  left: 100%;
}

.ew-top-1\\/2 {
  top: 50%;
}

.ew-left-0 {
  left: 0px;
}

.ew-top-1 {
  top: 0.25rem;
}

.ew-right-1 {
  right: 0.25rem;
}

.ew-right-2 {
  right: 0.5rem;
}

.ew-left-1 {
  left: 0.25rem;
}

.ew-right-3 {
  right: 0.75rem;
}

.-ew-top-2 {
  top: -0.5rem;
}

.ew-z-0 {
  z-index: 0;
}

.ew-z-\\[9999\\] {
  z-index: 9999;
}

.ew-m-0 {
  margin: 0px;
}

.ew-m-5 {
  margin: 1.25rem;
}

.ew-m-4 {
  margin: 1rem;
}

.-ew-mb-2\\.5 {
  margin-bottom: -0.625rem;
}

.-ew-ml-2\\.5 {
  margin-left: -0.625rem;
}

.-ew-mb-2 {
  margin-bottom: -0.5rem;
}

.-ew-ml-2 {
  margin-left: -0.5rem;
}

.ew-mt-2 {
  margin-top: 0.5rem;
}

.-ew-mt-0\\.5 {
  margin-top: -0.125rem;
}

.-ew-mt-0 {
  margin-top: -0px;
}

.-ew-mt-\\[3px\\] {
  margin-top: -3px;
}

.-ew-ml-5 {
  margin-left: -1.25rem;
}

.-ew-mt-5 {
  margin-top: -1.25rem;
}

.-ew-mb-1 {
  margin-bottom: -0.25rem;
}

.-ew-ml-1 {
  margin-left: -0.25rem;
}

.-ew-ml-4 {
  margin-left: -1rem;
}

.-ew-mt-4 {
  margin-top: -1rem;
}

.-ew-mt-3 {
  margin-top: -0.75rem;
}

.-ew-ml-3 {
  margin-left: -0.75rem;
}

.-ew-ml-6 {
  margin-left: -1.5rem;
}

.-ew-mt-6 {
  margin-top: -1.5rem;
}

.ew-mb-2 {
  margin-bottom: 0.5rem;
}

.ew-mb-1 {
  margin-bottom: 0.25rem;
}

.ew-box-border {
  box-sizing: border-box;
}

.ew-block {
  display: block;
}

.ew-inline-block {
  display: inline-block;
}

.ew-flex {
  display: flex;
}

.ew-inline-flex {
  display: inline-flex;
}

.ew-grid {
  display: grid;
}

.ew-hidden {
  display: none;
}

.ew-h-\\[40px\\] {
  height: 40px;
}

.ew-h-\\[32px\\] {
  height: 32px;
}

.ew-h-1 {
  height: 0.25rem;
}

.ew-h-\\[6px\\] {
  height: 6px;
}

.ew-h-10 {
  height: 2.5rem;
}

.ew-h-8 {
  height: 2rem;
}

.ew-h-6 {
  height: 1.5rem;
}

.ew-h-full {
  height: 100%;
}

.ew-h-12 {
  height: 3rem;
}

.ew-h-16 {
  height: 4rem;
}

.ew-h-24 {
  height: 6rem;
}

.ew-h-32 {
  height: 8rem;
}

.ew-h-20 {
  height: 5rem;
}

.ew-h-4 {
  height: 1rem;
}

.ew-h-2 {
  height: 0.5rem;
}

.ew-h-fit {
  height: -moz-fit-content;
  height: fit-content;
}

.ew-h-9 {
  height: 2.25rem;
}

.ew-h-7 {
  height: 1.75rem;
}

.ew-h-1\\.5 {
  height: 0.375rem;
}

.ew-max-h-\\[80\\%\\] {
  max-height: 80%;
}

.ew-min-h-\\[48px\\] {
  min-height: 48px;
}

.ew-w-full {
  width: 100%;
}

.ew-w-\\[40\\%\\] {
  width: 40%;
}

.ew-w-\\[60\\%\\] {
  width: 60%;
}

.ew-w-10 {
  width: 2.5rem;
}

.ew-w-8 {
  width: 2rem;
}

.ew-w-1 {
  width: 0.25rem;
}

.ew-w-4 {
  width: 1rem;
}

.ew-w-2 {
  width: 0.5rem;
}

.ew-w-6 {
  width: 1.5rem;
}

.ew-w-12 {
  width: 3rem;
}

.ew-w-fit {
  width: -moz-fit-content;
  width: fit-content;
}

.ew-w-1\\.5 {
  width: 0.375rem;
}

.ew-min-w-full {
  min-width: 100%;
}

.ew-max-w-md {
  max-width: 28rem;
}

.ew-max-w-full {
  max-width: 100%;
}

.ew-shrink-0 {
  flex-shrink: 0;
}

.ew-grow {
  flex-grow: 1;
}

.ew-translate-y-0 {
  --tw-translate-y: 0px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.ew-translate-y-0\\.5 {
  --tw-translate-y: 0.125rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.ew-rotate-\\[45deg\\] {
  --tw-rotate: 45deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.ew-scale-0 {
  --tw-scale-x: 0;
  --tw-scale-y: 0;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.ew-scale-100 {
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.ew-scale-90 {
  --tw-scale-x: .9;
  --tw-scale-y: .9;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

@keyframes ew-fade-slide {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.9);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.ew-animate-fade-slide {
  animation: ew-fade-slide 0.4s ease-out;
}

.ew-list-none {
  list-style-type: none;
}

.ew-appearance-none {
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
}

.ew-flex-col {
  flex-direction: column;
}

.ew-content-center {
  align-content: center;
}

.ew-content-start {
  align-content: flex-start;
}

.ew-items-start {
  align-items: flex-start;
}

.ew-items-center {
  align-items: center;
}

.ew-justify-start {
  justify-content: flex-start;
}

.ew-justify-center {
  justify-content: center;
}

.ew-justify-between {
  justify-content: space-between;
}

.ew-gap-6 {
  gap: 1.5rem;
}

.ew-gap-4 {
  gap: 1rem;
}

.ew-gap-2 {
  gap: 0.5rem;
}

.ew-gap-1 {
  gap: 0.25rem;
}

.ew-space-x-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(0.5rem * var(--tw-space-x-reverse));
  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
}

.ew--space-x-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(-0.5rem * var(--tw-space-x-reverse));
  margin-left: calc(-0.5rem * calc(1 - var(--tw-space-x-reverse)));
}

.ew-self-end {
  align-self: flex-end;
}

.ew-overflow-auto {
  overflow: auto;
}

.ew-overflow-hidden {
  overflow: hidden;
}

.ew-whitespace-pre-wrap {
  white-space: pre-wrap;
}

.ew-rounded-full {
  border-radius: 9999px;
}

.ew-rounded-lg {
  border-radius: 0.5rem;
}

.ew-rounded-\\[20px\\] {
  border-radius: 20px;
}

.ew-rounded-\\[16px\\] {
  border-radius: 16px;
}

.ew-rounded {
  border-radius: 0.25rem;
}

.ew-rounded-xl {
  border-radius: 0.75rem;
}

.ew-rounded-md {
  border-radius: 0.375rem;
}

.ew-border {
  border-width: 1px;
}

.ew-border-0 {
  border-width: 0px;
}

.ew-border-\\[3px\\] {
  border-width: 3px;
}

.ew-border-2 {
  border-width: 2px;
}

.ew-border-t-2 {
  border-top-width: 2px;
}

.ew-border-l-2 {
  border-left-width: 2px;
}

.ew-border-l-\\[6px\\] {
  border-left-width: 6px;
}

.ew-border-t {
  border-top-width: 1px;
}

.ew-border-l {
  border-left-width: 1px;
}

.ew-border-l-0 {
  border-left-width: 0px;
}

.ew-border-r-0 {
  border-right-width: 0px;
}

.ew-border-l-4 {
  border-left-width: 4px;
}

.ew-border-solid {
  border-style: solid;
}

.ew-border-none {
  border-style: none;
}

.ew-border-base-bg {
  --tw-border-opacity: 1;
  border-color: rgb(var(--theme-base-bg-ch) / var(--tw-border-opacity));
}

.ew-border-base-aux {
  --tw-border-opacity: 1;
  border-color: rgb(var(--theme-base-aux-ch) / var(--tw-border-opacity));
}

.ew-border-current {
  border-color: currentColor;
}

.ew-border-base-aux\\/20 {
  border-color: rgb(var(--theme-base-aux-ch) / 0.2);
}

.ew-border-base-fg {
  --tw-border-opacity: 1;
  border-color: rgb(var(--theme-base-fg-ch) / var(--tw-border-opacity));
}

.ew-border-primary-fg {
  --tw-border-opacity: 1;
  border-color: rgb(var(--theme-primary-fg-ch) / var(--tw-border-opacity));
}

.ew-border-base-aux\\/30 {
  border-color: rgb(var(--theme-base-aux-ch) / 0.3);
}

.ew-border-base-aux\\/10 {
  border-color: rgb(var(--theme-base-aux-ch) / 0.1);
}

.ew-border-opacity-50 {
  --tw-border-opacity: 0.5;
}

.ew-border-opacity-30 {
  --tw-border-opacity: 0.3;
}

.ew-bg-transparent {
  background-color: transparent;
}

.ew-bg-base-bg {
  --tw-bg-opacity: 1;
  background-color: rgb(var(--theme-base-bg-ch) / var(--tw-bg-opacity));
}

.ew-bg-danger-fg\\/10 {
  background-color: rgb(var(--theme-danger-fg-ch) / 0.1);
}

.ew-bg-warning-fg\\/10 {
  background-color: rgb(var(--theme-warning-fg-ch) / 0.1);
}

.ew-bg-success-fg\\/10 {
  background-color: rgb(var(--theme-success-fg-ch) / 0.1);
}

.ew-bg-base-aux\\/10 {
  background-color: rgb(var(--theme-base-aux-ch) / 0.1);
}

.ew-bg-base-aux\\/30 {
  background-color: rgb(var(--theme-base-aux-ch) / 0.3);
}

.ew-bg-current {
  background-color: currentColor;
}

.ew-bg-primary-fg\\/10 {
  background-color: rgb(var(--theme-primary-fg-ch) / 0.1);
}

.ew-bg-danger-fg {
  --tw-bg-opacity: 1;
  background-color: rgb(var(--theme-danger-fg-ch) / var(--tw-bg-opacity));
}

.ew-bg-warning-fg {
  --tw-bg-opacity: 1;
  background-color: rgb(var(--theme-warning-fg-ch) / var(--tw-bg-opacity));
}

.ew-bg-success-fg {
  --tw-bg-opacity: 1;
  background-color: rgb(var(--theme-success-fg-ch) / var(--tw-bg-opacity));
}

.ew-bg-base-aux {
  --tw-bg-opacity: 1;
  background-color: rgb(var(--theme-base-aux-ch) / var(--tw-bg-opacity));
}

.ew-bg-primary-fg {
  --tw-bg-opacity: 1;
  background-color: rgb(var(--theme-primary-fg-ch) / var(--tw-bg-opacity));
}

.ew-bg-base-fg {
  --tw-bg-opacity: 1;
  background-color: rgb(var(--theme-base-fg-ch) / var(--tw-bg-opacity));
}

.ew-bg-primary-bg {
  --tw-bg-opacity: 1;
  background-color: rgb(var(--theme-primary-bg-ch) / var(--tw-bg-opacity));
}

.ew-bg-neutral-bg {
  --tw-bg-opacity: 1;
  background-color: rgb(var(--theme-neutral-bg-ch) / var(--tw-bg-opacity));
}

.ew-bg-neutral-aux {
  --tw-bg-opacity: 1;
  background-color: rgb(var(--theme-neutral-aux-ch) / var(--tw-bg-opacity));
}

.ew-bg-danger-bg {
  --tw-bg-opacity: 1;
  background-color: rgb(var(--theme-danger-bg-ch) / var(--tw-bg-opacity));
}

.ew-bg-base-aux\\/\\[0\\.07\\] {
  background-color: rgb(var(--theme-base-aux-ch) / 0.07);
}

.ew-bg-yellow-300 {
  --tw-bg-opacity: 1;
  background-color: rgb(253 224 71 / var(--tw-bg-opacity));
}

.ew-p-2 {
  padding: 0.5rem;
}

.ew-p-4 {
  padding: 1rem;
}

.ew-p-3 {
  padding: 0.75rem;
}

.ew-p-0 {
  padding: 0px;
}

.ew-p-6 {
  padding: 1.5rem;
}

.ew-p-5 {
  padding: 1.25rem;
}

.ew-px-2\\.5 {
  padding-left: 0.625rem;
  padding-right: 0.625rem;
}

.ew-py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.ew-px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.ew-px-5 {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}

.ew-px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.ew-py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.ew-px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.ew-px-0 {
  padding-left: 0px;
  padding-right: 0px;
}

.ew-py-0 {
  padding-top: 0px;
  padding-bottom: 0px;
}

.ew-py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.ew-py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.ew-px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.ew-pl-0 {
  padding-left: 0px;
}

.ew-pb-1 {
  padding-bottom: 0.25rem;
}

.ew-pt-0\\.5 {
  padding-top: 0.125rem;
}

.ew-pt-0 {
  padding-top: 0px;
}

.ew-pl-2 {
  padding-left: 0.5rem;
}

.ew-pr-4 {
  padding-right: 1rem;
}

.ew-pt-1 {
  padding-top: 0.25rem;
}

.ew-pb-2 {
  padding-bottom: 0.5rem;
}

.ew-pb-0 {
  padding-bottom: 0px;
}

.ew-pr-10 {
  padding-right: 2.5rem;
}

.ew-pl-3 {
  padding-left: 0.75rem;
}

.ew-pt-\\[10px\\] {
  padding-top: 10px;
}

.ew-pt-6 {
  padding-top: 1.5rem;
}

.ew-pr-3 {
  padding-right: 0.75rem;
}

.ew-pr-6 {
  padding-right: 1.5rem;
}

.ew-pr-0 {
  padding-right: 0px;
}

.ew-pt-3 {
  padding-top: 0.75rem;
}

.ew-pt-2 {
  padding-top: 0.5rem;
}

.ew-pr-24 {
  padding-right: 6rem;
}

.ew-pr-8 {
  padding-right: 2rem;
}

.ew-pr-12 {
  padding-right: 3rem;
}

.ew-text-left {
  text-align: left;
}

.ew-font-text {
  font-family: var(--theme-font-text);
}

.ew-text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.ew-text-base {
  font-size: 1rem;
  line-height: 1.5rem;
}

.ew-text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.ew-font-semibold {
  font-weight: 600;
}

.ew-font-normal {
  font-weight: 400;
}

.ew-font-bold {
  font-weight: 700;
}

.ew-font-medium {
  font-weight: 500;
}

.ew-uppercase {
  text-transform: uppercase;
}

.ew-leading-none {
  line-height: 1;
}

.ew-tracking-wider {
  letter-spacing: 0.05em;
}

.ew-text-base-fg {
  --tw-text-opacity: 1;
  color: rgb(var(--theme-base-fg-ch) / var(--tw-text-opacity));
}

.ew-text-base-aux {
  --tw-text-opacity: 1;
  color: rgb(var(--theme-base-aux-ch) / var(--tw-text-opacity));
}

.ew-text-danger-fg {
  --tw-text-opacity: 1;
  color: rgb(var(--theme-danger-fg-ch) / var(--tw-text-opacity));
}

.ew-text-warning-fg {
  --tw-text-opacity: 1;
  color: rgb(var(--theme-warning-fg-ch) / var(--tw-text-opacity));
}

.ew-text-success-fg {
  --tw-text-opacity: 1;
  color: rgb(var(--theme-success-fg-ch) / var(--tw-text-opacity));
}

.ew-text-transparent {
  color: transparent;
}

.ew-text-primary-fg {
  --tw-text-opacity: 1;
  color: rgb(var(--theme-primary-fg-ch) / var(--tw-text-opacity));
}

.ew-text-base-bg {
  --tw-text-opacity: 1;
  color: rgb(var(--theme-base-bg-ch) / var(--tw-text-opacity));
}

.ew-text-primary-aux {
  --tw-text-opacity: 1;
  color: rgb(var(--theme-primary-aux-ch) / var(--tw-text-opacity));
}

.ew-text-neutral-aux {
  --tw-text-opacity: 1;
  color: rgb(var(--theme-neutral-aux-ch) / var(--tw-text-opacity));
}

.ew-text-danger-aux {
  --tw-text-opacity: 1;
  color: rgb(var(--theme-danger-aux-ch) / var(--tw-text-opacity));
}

.ew-no-underline {
  text-decoration-line: none;
}

.ew-opacity-20 {
  opacity: 0.2;
}

.ew-opacity-\\[0\\.55\\] {
  opacity: 0.55;
}

.ew-opacity-40 {
  opacity: 0.4;
}

.ew-opacity-30 {
  opacity: 0.3;
}

.ew-opacity-80 {
  opacity: 0.8;
}

.ew-opacity-60 {
  opacity: 0.6;
}

.ew-opacity-50 {
  opacity: 0.5;
}

.ew-opacity-0 {
  opacity: 0;
}

.ew-opacity-100 {
  opacity: 1;
}

.ew-shadow-lg {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.ew-shadow {
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.ew-shadow-xl {
  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.ew-shadow-none {
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.ew-shadow-md {
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.ew-shadow-black {
  --tw-shadow-color: #000;
  --tw-shadow: var(--tw-shadow-colored);
}

.ew-outline-none {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.ew-outline-0 {
  outline-width: 0px;
}

.ew-outline-primary-fg {
  outline-color: rgb(var(--theme-primary-fg-ch));
}

.ew-ring-2 {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.ew-ring {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.ew-ring-0 {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.ew-ring-primary-fg {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(var(--theme-primary-fg-ch) / var(--tw-ring-opacity));
}

.ew-ring-primary-fg\\/50 {
  --tw-ring-color: rgb(var(--theme-primary-fg-ch) / 0.5);
}

.ew-ring-offset-0 {
  --tw-ring-offset-width: 0px;
}

.ew-transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.ew-transition {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.ew-transition-shadow {
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.ew-delay-500 {
  transition-delay: 500ms;
}

.ew-delay-1000 {
  transition-delay: 1000ms;
}

.ew-focusable {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  outline-width: 0px;
  --tw-ring-color: rgb(var(--theme-primary-fg-ch) / 0.5);
  --tw-ring-offset-width: 0px;
}

.ew-focusable:focus {
  --tw-border-opacity: 1;
  border-color: rgb(var(--theme-primary-fg-ch) / var(--tw-border-opacity));
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.ew-focusable-outline {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  outline-width: 0px;
  --tw-ring-color: rgb(var(--theme-primary-fg-ch) / 0.5);
  --tw-ring-offset-width: 0px;
}

.ew-focusable-outline:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

/* 
 * ======================================================
 * Input Reset and Icons
 * ======================================================
 */

.ew-select::-ms-expand {
  display: none;
}

.ew-input::-webkit-calendar-picker-indicator, 
.ew-input::-webkit-time-picker-indicator {
  background-image: none;
  visibility: hidden;
}

/* 
 * ======================================================
 * Slider
 * Styles are duplicated since selectors won't work if
 * used together (who knows why)
 * ======================================================
 */

.ew-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
          appearance: none;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background: currentColor;
}

.ew-slider::-moz-range-thumb  {
  -moz-appearance: none;
       appearance: none;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background: currentColor;
}

/* 
 * ======================================================
 * Tooltip
 * ======================================================
 */

.ew-tooltip::after {
  content: "";
  display: block;
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -2px;
  border-style: solid;
  border-width: 4px 4px 0 4px;
  border-color: var(--theme-neutral-bg) transparent transparent transparent;
}

/* 
 * ======================================================
 * Loading
 * ======================================================
 */

.ew-loading-dots {
  display: inline-block;
  position: relative;
  width: var(--size);
  height: var(--size);
}

.ew-loading-dots div {
  position: absolute;
  top: calc(var(--size) * 0.4);
  width: calc(var(--size) * 0.2);
  height: calc(var(--size) * 0.2);
  border-radius: calc(var(--size) * 0.2);
  background: var(--color);
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.ew-loading-dots > div:nth-child(1) {
  left: 0;
  animation: ew-loading-dots-1 0.6s infinite;
}

.ew-loading-dots > div:nth-child(2) {
  left: 0;
  animation: ew-loading-dots-2 0.6s infinite;
}

.ew-loading-dots > div:nth-child(3) {
  left: calc(var(--size) * 0.4);
  animation: ew-loading-dots-2 0.6s infinite;
}

.ew-loading-dots > div:nth-child(4) {
  left: calc(var(--size) * 0.8);
  animation: ew-loading-dots-3 0.6s infinite;
}

@keyframes ew-loading-dots-1 {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes ew-loading-dots-2 {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(calc(var(--size) * 0.4), 0);
  }
}

@keyframes ew-loading-dots-3 {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}

.ew-loading-ripples {
  display: inline-block;
  position: relative;
  width: var(--size);
  height: var(--size);
}

.ew-loading-ripples > div {
  position: absolute;
  border: calc(var(--size) * 0.06) solid var(--color);
  opacity: 1;
  border-radius: 50%;
  animation: ew-loading-ripples 1.2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.ew-loading-ripples > div:nth-child(2) {
  animation-delay: -0.6s;
}

@keyframes ew-loading-ripples {
  0% {
    top: calc(var(--size) * 0.5);
    left: calc(var(--size) * 0.5);
    width: 0;
    height: 0;
    opacity: 1;
  }

  100% {
    top: 0;
    left: 0;
    width: var(--size);
    height: var(--size);
    opacity: 0;
  }
}

.before\\:ew-absolute::before {
  content: var(--tw-content);
  position: absolute;
}

.before\\:ew-inset-0::before {
  content: var(--tw-content);
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}

.before\\:ew-block::before {
  content: var(--tw-content);
  display: block;
}

.before\\:ew-rounded-lg::before {
  content: var(--tw-content);
  border-radius: 0.5rem;
}

.before\\:ew-rounded-\\[20px\\]::before {
  content: var(--tw-content);
  border-radius: 20px;
}

.before\\:ew-rounded-\\[16px\\]::before {
  content: var(--tw-content);
  border-radius: 16px;
}

.before\\:ew-rounded-sm::before {
  content: var(--tw-content);
  border-radius: 0.125rem;
}

.before\\:ew-rounded-full::before {
  content: var(--tw-content);
  border-radius: 9999px;
}

.before\\:ew-rounded-r::before {
  content: var(--tw-content);
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
}

.before\\:ew-bg-current::before {
  content: var(--tw-content);
  background-color: currentColor;
}

.before\\:ew-opacity-0::before {
  content: var(--tw-content);
  opacity: 0;
}

.before\\:ew-opacity-10::before {
  content: var(--tw-content);
  opacity: 0.1;
}

.before\\:ew-transition-opacity::before {
  content: var(--tw-content);
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.before\\:ew-content-\\[\\'\\'\\]::before {
  --tw-content: '';
  content: var(--tw-content);
}

.hover\\:ew-block:hover {
  display: block;
}

.hover\\:ew-bg-base-aux\\/\\[0\\.07\\]:hover {
  background-color: rgb(var(--theme-base-aux-ch) / 0.07);
}

.hover\\:ew-bg-primary-fg\\/\\[0\\.15\\]:hover {
  background-color: rgb(var(--theme-primary-fg-ch) / 0.15);
}

.hover\\:ew-opacity-\\[0\\.15\\]:hover {
  opacity: 0.15;
}

.hover\\:before\\:ew-opacity-\\[0\\.15\\]:hover::before {
  content: var(--tw-content);
  opacity: 0.15;
}

.hover\\:before\\:ew-opacity-\\[0\\.05\\]:hover::before {
  content: var(--tw-content);
  opacity: 0.05;
}

.focus\\:ew-border-primary-fg:focus {
  --tw-border-opacity: 1;
  border-color: rgb(var(--theme-primary-fg-ch) / var(--tw-border-opacity));
}

.focus\\:ew-bg-base-bg:focus {
  --tw-bg-opacity: 1;
  background-color: rgb(var(--theme-base-bg-ch) / var(--tw-bg-opacity));
}

.focus\\:ew-outline-0:focus {
  outline-width: 0px;
}

.focus\\:ew-ring:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.read-only\\:focus\\:ew-bg-base-aux\\/10:focus:-moz-read-only {
  background-color: rgb(var(--theme-base-aux-ch) / 0.1);
}

.read-only\\:focus\\:ew-bg-base-aux\\/10:focus:read-only {
  background-color: rgb(var(--theme-base-aux-ch) / 0.1);
}

.active\\:ew-bg-base-aux\\/10:active {
  background-color: rgb(var(--theme-base-aux-ch) / 0.1);
}

.active\\:ew-bg-primary-fg\\/20:active {
  background-color: rgb(var(--theme-primary-fg-ch) / 0.2);
}

.disabled\\:ew-border-base-aux\\/\\[0\\.25\\]:disabled {
  border-color: rgb(var(--theme-base-aux-ch) / 0.25);
}

.disabled\\:ew-bg-base-aux\\/\\[0\\.25\\]:disabled {
  background-color: rgb(var(--theme-base-aux-ch) / 0.25);
}

.ew-group:focus-within .group-focus-within\\:ew-block {
  display: block;
}

.ew-group:focus-within .group-focus-within\\:ew-scale-100 {
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.ew-group:hover .group-hover\\:ew-translate-y-0 {
  --tw-translate-y: 0px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.ew-group:hover .group-hover\\:ew-delay-500 {
  transition-delay: 500ms;
}

.ew-group:hover .group-hover\\:ew-delay-1000 {
  transition-delay: 1000ms;
}

""" ]