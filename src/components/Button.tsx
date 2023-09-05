import { ButtonHTMLAttributes } from "react";

import "../styles/button.scss";

// vai receber todas as propriedades de um button nativo do html
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
};

export function Button({ isOutlined = false, ...props }: ButtonProps) {
  return (
    /* 
    spread operator que basicamente vai distribuir toda as propriedades
    que eu receber como parâmetros para dentro do botão
    */
    <button
      className={`button ${isOutlined ? "outlined" : ""}`}
      {...props}
    ></button>
  );
}
