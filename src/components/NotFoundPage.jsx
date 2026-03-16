import {Link} from "react-router-dom"
const NotFoundPage = () => {
  return (
    <section className="flex items-center justify-center min-h-screen bg-white text-black">
      <div className="text-center w-full max-w-xl px-4">
        
        <div
          className="h-[400px] bg-center bg-no-repeat flex items-start justify-center"
          style={{
            backgroundImage:
              "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)",
          }}
        >
          <h1 className="text-[80px] font-bold">404</h1>
        </div>

        <div className="-mt-12">
          <h3 className="text-3xl font-semibold">Look like you're lost</h3>
          <p className="mt-2 text-gray-600">
            The page you are looking for is not available!
          </p>

          <Link
            to="/"
            className="inline-block mt-5 px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Go Back
          </Link>
        </div>

      </div>
    </section>
  );
};

export default NotFoundPage;