import type { FC } from "react";

export interface CountLabelProps {
  value: number;
}

export const CountLabel: FC<CountLabelProps> = ({ value }) => {
  return <h1>{value}</h1>;
};
