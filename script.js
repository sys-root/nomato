howMuchDidISpendOnZomato = async () => {
  let totalPages = 0;
  const allPromises = [];
  const meta = await fetch(
    `https://www.zomato.com/webroutes/user/orders?page=${0}`
  ).then((data) => {
    return data.json().then((resp) => {
      return resp;
    });
  });

  totalPages = meta.sections.SECTION_USER_ORDER_HISTORY.totalPages;

  let progressString = "=";
  for (let i = 1; i <= totalPages; i++) {
    console.log(progressString);
    progressString += "=";
    allPromises.push(
      fetch(`https://www.zomato.com/webroutes/user/orders?page=${i}`).then(
        (data) => {
          return data.json().then((response) => {
            let totalCostPerPage = 0;
            const orderDetails = response.entities.ORDER;
            Object.keys(orderDetails).map((order) => {
              if (orderDetails[order].status == 6) {
                totalCostPerPage += Number(
                  orderDetails[order].totalCost
                    .replace("\u20b9", "")
                    .replace(/,/g, "")
                );
              }
            });
            return totalCostPerPage;
          });
        }
      )
    );
  }

  Promise.all(allPromises).then((result) => {
    let totalExpense = 0;
    result.forEach((entry) => (totalExpense += entry));
    console.log(
      `%cYou almost burned, RS. ${Math.round(totalExpense)} on Zomato`,
      `color: #f5f5f5;
    text-shadow:
    0px -2px 4px #fff,
    0px -2px 10px #FF3,
    0px -10px 20px #F90,
    0px -20px 40px #C33;
    font-size: 5em;`
    );
  });
};

howMuchDidISpendOnZomato();
