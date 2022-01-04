import { useState } from "react";
import axios from "axios";
import store from "store2";
import { BASEURL } from "../utils/constant";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitLogin = async () => {
    const url = `${BASEURL}/auth/local`;
    const res = await axios.post(url, {
      identifier: email,
      password: password,
    });

    if (res.status === 200) {
      store.set("access", res.data.jwt);
      if (props.onSetLogin) props.onSetLogin(true);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitLogin();
      }}
    >
      <div className="mb-3 row">
        <label for="staticEmail" className="col-sm-3 col-form-label">
          Email
        </label>
        <div className="col-sm-9">
          <input
            type="text"
            className="form-control"
            id="staticEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-3 row">
        <label for="inputPassword" className="col-sm-3 col-form-label">
          Password
        </label>
        <div className="col-sm-9">
          <input
            type="password"
            className="form-control"
            id="inputPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mt-4">
            <button className="btn btn-success w-50" type="submit">
              Login
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Login;
