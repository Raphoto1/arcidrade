import type { CalendarRangeProps, CalendarMonthProps, CalendarDateProps, CalendarMultiProps } from "cally";


type MapEvents<T> = {
  [K in keyof T as K extends `on${infer E}` ? `on${Lowercase<E>}` : K]: T[K];
};

declare namespace JSX {
  interface IntrinsicElements {
    "calendar-range": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    "calendar-month": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
  interface CalendarDateElement extends HTMLElement {
    setFocusedDate?: (date: string) => void;
  }
}


declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "calendar-month": MapEvents<CalendarMonthProps> &
        React.HTMLAttributes<HTMLElement> &
        React.RefAttributes<HTMLElement>;

      "calendar-range": MapEvents<CalendarRangeProps> &
        React.HTMLAttributes<HTMLElement> &
        React.RefAttributes<HTMLElement>;

      "calendar-date": MapEvents<CalendarDateProps> &
        React.HTMLAttributes<HTMLElement> &
        React.RefAttributes<HTMLElement>;

      "calendar-multi": MapEvents<CalendarMultiProps> &
        React.HTMLAttributes<HTMLElement> &
        React.RefAttributes<HTMLElement>;
    }
  }
}
