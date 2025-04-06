import { serialize } from "cookie";

export const routeRedirection = (req, resolvedUrl, res) => {
  let foundToken = false;

  if (resolvedUrl.startsWith('/book')) {
    const splited = resolvedUrl.split('?');
    if (splited.length > 1) {
      const token = splited[1].split('=')[1];
      if (token) {
        foundToken = token;

        // const cookie = serialize("ibook-auth", token, {
        //   path: "/",
        // });

        // res.setHeader("Set-Cookie", cookie);
      }
    }
  }
  console.log(foundToken);
  if (foundToken) return false;

  const authenticated = req.cookies["ibook-auth"];

  const authenticatedUserData =
    req.cookies["EmicrolearnUser"] &&
    JSON.parse(req.cookies["EmicrolearnUser"]);

  const parentOptions =
    req.cookies["EmicrolearnParentOptions"] &&
    JSON.parse(req.cookies["EmicrolearnParentOptions"]);

  const userType = authenticatedUserData && authenticatedUserData.type;

  const requireNoAuthRoutes = ["/signup", "/login", "/login-parents"];

  const requireAuthRoutes = [
    "/home",
    "/levels",
    "/levels/books",
    "/reports",
    "/quizzes-reports",
    "/book",
    "/parent",
  ];

  const studentRoutes = [
    "/home",
    "/levels",
    "/levels/books",
    "/reports",
    "/quizzes-reports",
    "/book",
  ];

  const parentRoutes = ["/parent", "/add-student"];

  const requireNoAuth = requireNoAuthRoutes.find((route) =>
    resolvedUrl.startsWith(route)
  );

  const requireAuth = requireAuthRoutes.find((route) =>
    resolvedUrl.startsWith(route)
  );

  const requireStudent = studentRoutes.find((route) =>
    resolvedUrl.startsWith(route)
  );

  const requireParent = parentRoutes.find((route) =>
    resolvedUrl.startsWith(route)
  );

  if (authenticated && requireNoAuth) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  } else if (
    requireParent &&
    resolvedUrl === "/add-student" &&
    userType === "parent" &&
    parentOptions.feature_remaining <= 0
  ) {
    return {
      redirect: {
        destination: "/parent",
        permanent: false,
      },
    };
  } else if (authenticated && requireAuth) {
    if (requireParent && userType === "student") {
      return {
        redirect: {
          destination: "/home",
          permanent: false,
        },
      };
    } else if (requireStudent && userType === "parent") {
      return {
        redirect: {
          destination: "/parent",
          permanent: false,
        },
      };
    } else if (!authenticated && requireAuth) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  } else if (!authenticated && requireAuth) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return false;
};
