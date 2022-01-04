import CryptoList from "./components/CryptoList";
import Login from "./components/Login";
import MyWallet from "./components/MyWallet";
import axios from "axios";
import store from "store2";
import { useEffect, useState } from "react";
import { BASEURL } from "./utils/constant";

function App() {
  const [wallet, setWallet] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    const jwt = Boolean(store.get("access"));
    if (jwt) {
      getCoins();
      setIsLogin(true);
    }
  }, []);

  const getCoins = async () => {
    const url = `${BASEURL}/wallet/me`;
    const jwt = store.get("access");
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    if (res.status === 200) {
      const { data } = res.data;
      setWallet(data.attributes.portfolio);
    }
  };

  return (
    <div className="container-xl">
      <h2 className="text-success my-4">KOMODO CRYPTO MARKET</h2>
      <div className="row">
        <div className="col-7">
          <h5>CRYPTO LIST</h5>
          <div>
            <CryptoList
              isLogin={isLogin}
              data={wallet}
              submitFallback={(newWallet) =>
                setWallet(newWallet.data.attributes.portfolio)
              }
            />
          </div>
        </div>
        <div className="col-5">
          {isLogin ? (
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <h5>
                  <u>MY WALLET</u>
                </h5>
                <button
                  className="btn btn-link text-danger"
                  onClick={(e) => {
                    e.preventDefault();
                    store.remove("access");
                    setIsLogin(false);
                  }}
                >
                  Logout
                </button>
              </div>
              <MyWallet data={wallet} />
            </div>
          ) : (
            <Login
              onSetLogin={(value) => {
                setIsLogin(value);
                getCoins();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
