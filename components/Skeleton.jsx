const Skeleton = ({ number = 1 }) => {
  [];

  return (
    <div role="status" className="max-w-sm animate-pulse">
      {Array.from(Array(number).keys()).map((n) => (
        <div
          key={n}
          className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"
        ></div>
      ))}

      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Skeleton;
