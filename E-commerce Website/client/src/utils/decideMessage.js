const decideMessage = (status) => {
  const message =
    status === 401
      ? "You are not authorized to visit this page!"
      : status === 403
        ? "You dont have the permissions to visit this page!"
        : status === 404
          ? "The page you are looking for might not be available at the moment. \n Please try later!"
          : "Cannot connect to the server at the moment!";
  return message;
};


export default decideMessage;