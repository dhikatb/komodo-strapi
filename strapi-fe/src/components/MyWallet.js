function MyWallet({ data }) {
  return (
    <table className="table table-sm">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Coin</th>
          <th scope="col">Current Price</th>
          <th scope="col">Qty</th>
          <th scope="col">Asset Value</th>
        </tr>
      </thead>
      <tbody>
        {data.length ? (
          data.map((portfolio, index) => {
            const coin = portfolio.coin.data.attributes;
            const total = portfolio.quantity * coin.usdt_price;
            return (
              <tr key={portfolio.id}>
                <th scope="row">{index + 1}</th>
                <td>
                  {coin.name} ({coin.code})
                </td>
                <td>{coin.usdt_price}</td>
                <td>{portfolio.quantity}</td>
                <td>{total}</td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={4} className="text-center">
              KOSONG
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default MyWallet;
