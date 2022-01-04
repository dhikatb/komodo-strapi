import { useEffect, useState } from "react";
import axios from "axios";
import store from "store2";
import update from "immutability-helper";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { BASEURL } from "../utils/constant";

function CryptoList({ data, isLogin, submitFallback }) {
  const [crypto, setCrypto] = useState([]);
  const [trade, setTrade] = useState({ show: false, data: undefined });
  const [newQty, setNewQty] = useState(0);

  useEffect(() => {
    getCoins();
  }, []);

  const getCoins = async () => {
    const url = `${BASEURL}/coins`;
    const res = await axios.get(url);
    if (res.status === 200) {
      const { data } = res.data;
      setCrypto(data);
    }
  };

  const submitTrade = async (coin, qty) => {
    let portfolio = (data || []).map((c) => ({
      id: c.id,
      quantity: c.quantity,
      coin: { id: c.coin.data.id },
    }));
    const ownedCoin = portfolio.findIndex((x) => x.coin.id === coin.id);

    if (ownedCoin < 0) {
      portfolio.push({
        quantity: qty,
        coin: { id: coin.id },
      });
    } else {
      const updatedValue =
        qty === 0
          ? { $splice: [[ownedCoin, 1]] }
          : {
              [ownedCoin]: {
                quantity: { $set: qty },
              },
            };

      portfolio = update(portfolio, updatedValue);
    }

    const payload = {
      data: {
        portfolio,
      },
    };

    const jwt = store.get("access");
    const url = `${BASEURL}/wallet/me`;
    const res = await axios.put(url, payload, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    if (res.status === 200) {
      submitFallback(res.data);
    }
  };

  const ownedCoin = trade.show
    ? (data || []).find((x) => x.coin.data.id === trade.data.id)
    : undefined;

  return (
    <div className="row">
      {crypto.length
        ? crypto.map((coin) => (
            <CryptoCard
              key={coin.id}
              coin={coin}
              showBuy={isLogin}
              onBuySell={() => setTrade({ show: true, data: coin })}
            />
          ))
        : null}

      {trade.show && (
        <Modal isOpen={trade.show}>
          <ModalHeader
            toggle={() => {
              setTrade({ show: false, data: undefined });
              setNewQty(0);
            }}
          >
            BUY / SELL
          </ModalHeader>
          <ModalBody>
            <div>
              <h5 className="card-title">{trade.data.attributes.name}</h5>
              <p className="card-text">
                {`${trade.data.attributes.code}-USDT`}
                <br />
                Current Price: {trade.data.attributes.usdt_price}
                <br />
                Owned Quantity: {(ownedCoin && ownedCoin.quantity) || 0}
              </p>
              <div className="my-2">
                <label>Trade Buy/Sell</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Insert Quantity"
                  min={0}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (value < 0) value = 0;
                    setNewQty(value);
                  }}
                  value={newQty}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => setTrade({ show: false, data: undefined })}
            >
              Cancel
            </Button>
            <Button
              color="success"
              className="w-25"
              onClick={() => {
                const coin = trade.data;
                const qty = newQty;
                setTrade({ show: false, data: undefined });
                setNewQty(0);
                submitTrade(coin, qty);
              }}
            >
              Confirm
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}

function CryptoCard({ coin, showBuy, onBuySell }) {
  const attr = coin.attributes;
  return (
    <div className="col-4 mb-3">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">{attr.name}</h5>
          <p className="card-text">
            {`${attr.code}-USDT`}
            <br />
            Current Price: {attr.usdt_price}
          </p>
          {showBuy ? (
            <button className="btn btn-success w-100" onClick={onBuySell}>
              Buy / Sell
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default CryptoList;
