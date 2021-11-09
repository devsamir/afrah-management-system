import React from "react";
import { Button as RBButton, Spinner } from "react-bootstrap";
import classes from "./button.module.scss";

interface Props {
  isLoading?: boolean;
  onClick?: any;
  variant: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  type?: "button" | "submit" | "clear";
  className?: string;
  startIcon?: any;
  endIcon?: any;
}

const Button: React.FC<Props> = ({
  children,
  isLoading,
  onClick,
  variant,
  type,
  className,
  endIcon,
  startIcon,
}) => {
  return (
    <RBButton
      type={type}
      className={`position-relative ${className}`}
      variant={variant}
      onClick={onClick}
    >
      {isLoading && (
        <div className={classes["absolute-spinner"]}>
          <Spinner animation="border" role="status" size="sm" />
        </div>
      )}
      <span className="d-flex align-items-center">
        {startIcon}
        <span className="mx-1">{children}</span>
        {endIcon}
      </span>
    </RBButton>
  );
};

export default Button;
