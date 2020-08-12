import axios from "axios";
// if there is a token set it to the global header
// takes in token
const setAuthToken = (token) => {
  // if there is a token make set it
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    // if no token passed in delete it
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
// the x- prefix is a convention to give a non standerd header but could be called just abouth anything
//TODO make sure that the reset token and this auth token do not step on oneanother
