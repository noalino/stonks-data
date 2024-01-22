type EmptyViewProps = { message: string };

function EmptyView({ message }: EmptyViewProps) {
  return (
    <p className="ring-1 ring-slate-200 rounded-lg px-2 py-3 text-sm text-center">
      {message}
    </p>
  );
}

export default EmptyView;
