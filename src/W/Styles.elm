module W.Styles exposing (globalStyles)

{-|

@docs globalStyles

-}

import Html as H exposing (Html)

{-| -}
globalStyles : Html msg
globalStyles =
    H.node "style"
        []
        [ H.text """.ew-btn {
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

.ew-m-0 {
  margin: 0px;
}

.ew-box-border {
  box-sizing: border-box;
}

.ew-flex {
  display: flex;
}

.ew-h-\\[40px\\] {
  height: 40px;
}

.ew-h-\\[32px\\] {
  height: 32px;
}

.ew-h-10 {
  height: 2.5rem;
}

.ew-h-8 {
  height: 2rem;
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

.ew-max-h-\\[80\\%\\] {
  max-height: 80%;
}

.ew-w-full {
  width: 100%;
}

.ew-max-w-md {
  max-width: 28rem;
}

.ew-shrink-0 {
  flex-shrink: 0;
}

.ew-grow {
  flex-grow: 1;
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

.ew-items-center {
  align-items: center;
}

.ew-justify-center {
  justify-content: center;
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

.ew-rounded-full {
  border-radius: 9999px;
}

.ew-rounded-xl {
  border-radius: 0.75rem;
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

.ew-border-t {
  border-top-width: 1px;
}

.ew-border-l {
  border-left-width: 1px;
}

.ew-border-solid {
  border-style: solid;
}

.ew-border-none {
  border-style: none;
}

.ew-border-base-aux {
  --tw-border-opacity: 1;
  border-color: rgb(var(--theme-base-aux-ch) / var(--tw-border-opacity));
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

.ew-bg-primary-fg\\/10 {
  background-color: rgb(var(--theme-primary-fg-ch) / 0.1);
}

.ew-bg-primary-fg {
  --tw-bg-opacity: 1;
  background-color: rgb(var(--theme-primary-fg-ch) / var(--tw-bg-opacity));
}

.ew-bg-base-aux {
  --tw-bg-opacity: 1;
  background-color: rgb(var(--theme-base-aux-ch) / var(--tw-bg-opacity));
}

.ew-p-4 {
  padding: 1rem;
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

.ew-p-2 {
  padding: 0.5rem;
}

.ew-p-3 {
  padding: 0.75rem;
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

.ew-py-0 {
  padding-top: 0px;
  padding-bottom: 0px;
}

.ew-px-0 {
  padding-left: 0px;
  padding-right: 0px;
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

.ew-pt-6 {
  padding-top: 1.5rem;
}

.ew-pb-2 {
  padding-bottom: 0.5rem;
}

.ew-pr-3 {
  padding-right: 0.75rem;
}

.ew-pl-2 {
  padding-left: 0.5rem;
}

.ew-pr-0 {
  padding-right: 0px;
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

.ew-pl-0 {
  padding-left: 0px;
}

.ew-text-left {
  text-align: left;
}

.ew-font-text {
  font-family: var(--theme-font-text);
}

.ew-text-base {
  font-size: 1rem;
  line-height: 1.5rem;
}

.ew-text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.ew-text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.ew-font-bold {
  font-weight: 700;
}

.ew-uppercase {
  text-transform: uppercase;
}

.ew-text-base-fg {
  --tw-text-opacity: 1;
  color: rgb(var(--theme-base-fg-ch) / var(--tw-text-opacity));
}

.ew-text-primary-fg {
  --tw-text-opacity: 1;
  color: rgb(var(--theme-primary-fg-ch) / var(--tw-text-opacity));
}

.ew-text-base-aux {
  --tw-text-opacity: 1;
  color: rgb(var(--theme-base-aux-ch) / var(--tw-text-opacity));
}

.ew-text-base-bg {
  --tw-text-opacity: 1;
  color: rgb(var(--theme-base-bg-ch) / var(--tw-text-opacity));
}

.ew-no-underline {
  text-decoration-line: none;
}

.ew-opacity-20 {
  opacity: 0.2;
}

.ew-opacity-30 {
  opacity: 0.3;
}

.ew-shadow-none {
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.ew-shadow-lg {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
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

.before\\:ew-bg-current::before {
  content: var(--tw-content);
  background-color: currentColor;
}

.before\\:ew-opacity-0::before {
  content: var(--tw-content);
  opacity: 0;
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

.active\\:ew-bg-base-aux\\/10:active {
  background-color: rgb(var(--theme-base-aux-ch) / 0.1);
}

.active\\:ew-bg-primary-fg\\/20:active {
  background-color: rgb(var(--theme-primary-fg-ch) / 0.2);
}

""" ]