interface ListWrapperPorps {
  children: React.ReactNode;
}

export default function ListWrapper({ children }: ListWrapperPorps) {
  return <li className="shrink-0 h-full w-[272px] select-none">{children}</li>;
}
