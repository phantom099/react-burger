import { CSSProperties as ReactCSSProperties } from 'react';

declare module 'react' {
  interface CSSProperties extends ReactCSSProperties {
    '--offset'?: string;
    '--z-index'?: string;
  }
}