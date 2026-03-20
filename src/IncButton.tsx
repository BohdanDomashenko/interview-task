import type { FC } from "react";

export interface IncButtonProps {
  onClick: () => void;
}

export const IncButton: FC<IncButtonProps> = ({ onClick }) => {
  return <button onClick={onClick}>inc</button>;
};
