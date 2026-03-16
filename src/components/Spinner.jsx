const Spinner = () => {
    return (
      <div className="h-screen flex justify-center items-center relative">
        <div className="absolute top-[40%] border-t-2 w-20 h-20 border-red-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  };
  
  export default Spinner;