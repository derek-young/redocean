interface LoadingProps {
  height?: number;
  width?: number;
}

function Loading({ height = 24, width = 24 }: LoadingProps) {
  return (
    <div
      className="animate-spin rounded-full border-b-2 border-red-500"
      style={{ height: `${height}px`, width: `${width}px` }}
    ></div>
  );
}

export default Loading;
