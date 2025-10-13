import type { JSX as ReactJSX } from "react";

declare global {
  namespace JSX {
    export type Element = ReactJSX.Element;
    export type ElementType = ReactJSX.ElementType;
    export type IntrinsicElements = ReactJSX.IntrinsicElements;
    export type IntrinsicAttributes = ReactJSX.IntrinsicAttributes;
  }
}

export {};
