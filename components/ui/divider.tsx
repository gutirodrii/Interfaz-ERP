type DividerProps = {
  text?: string;
};

export function Divider({ text = "o" }: DividerProps) {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-line" />
      <span className="text-sm text-text-secondary">{text}</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
