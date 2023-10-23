import { HTMLProps } from "react";

// Just a reqular <div /> that's a little bit more clear and obvious in what it does
const Placeholder = (props: HTMLProps<HTMLDivElement>) => <div {...props} />;

export default Placeholder;
