export type CommonButtonType = {
  text: string;
  disabled?: boolean;
  type?: any;
  width?: string;
  onClick?: any;
};

export type RedirectButtonType = CommonButtonType & { to: string };
