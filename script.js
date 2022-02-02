const transactionsUl = document.querySelector("#transactions");
const incomeDisplay = document.querySelector("#money-plus");
const expenseDisplay = document.querySelector("#money-minus");
const balanceDisplay = document.querySelector("#balance");
const form = document.querySelector("#form");
const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");
const errorDisplay = document.querySelector("#error-display");
const emptyTransactionsList = document.querySelector(
  "#empty-transactions-list"
);

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

const removeTransaction = (ID) => {
  transactions = transactions.filter((transaction) => transaction.id !== ID);
  updateLocalStorage();
  init();
};

const addTransactionIntoDOM = ({ amount, name, id }) => {
  const operator = amount < 0 ? "-" : "+";
  const CSSClass = amount < 0 ? "minus" : "plus";
  const amountWithoutOperador = Math.abs(amount).toFixed(2);
  const li = document.createElement("li");

  li.classList.add(CSSClass);
  li.innerHTML = `
    ${name}
    <span> ${operator} R$ ${amountWithoutOperador} </span>
    <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
  `;
  transactionsUl.prepend(li);
};

const getExpenses = (transcationsAmounts) =>
  Math.abs(
    transcationsAmounts
      .filter((value) => value < 0)
      .reduce((accumulator, value) => accumulator + value, 0)
  ).toFixed(2);

const getIncomes = (transcationsAmounts) =>
  transcationsAmounts
    .filter((value) => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2);

const getTotal = (transcationsAmounts) =>
  transcationsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2);

const updateBalanceValues = () => {
  const transcationsAmounts = transactions.map(({ amount }) => amount);
  const total = getTotal(transcationsAmounts);
  const income = getIncomes(transcationsAmounts);
  const expense = getExpenses(transcationsAmounts);
  balanceDisplay.textContent = `R$ ${total}`;
  incomeDisplay.textContent = `R$ ${income}`;
  expenseDisplay.textContent = `R$ ${expense}`;
};

const init = () => {
  transactionsUl.innerHTML = ``;

  if (transactions === null || transactions.length === 0) {
    transactionsUl.innerHTML = `
    <div class="alert-message">
       Não há nenhuma transação cadastrada :(
    </div>`;
  } else {
    emptyTransactionsList.innerHTML = ``;
  }

  transactions.forEach(addTransactionIntoDOM);
  updateBalanceValues();
};

init();

const updateLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

const generateID = () => Math.round(Math.random() * 1000);

const addToTransactionsArray = (transactionName, transactionAmount) => {
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount),
  });
};

const clearInputs = () => {
  inputTransactionName.value = "";
  inputTransactionAmount.value = "";
};

const handleFormSubmit = (event) => {
  event.preventDefault();

  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();
  const isSomeInputEmpty = transactionName === "" || transactionAmount === "";

  if (isSomeInputEmpty) {
    errorDisplay.innerHTML = `
    <div class="alert-message">
       Por favor, preencha tanto o nome quanto o valor da transação.
    </div>`;
    return;
  }

  errorDisplay.innerHTML = ``;

  addToTransactionsArray(transactionName, transactionAmount);
  updateLocalStorage();
  init();
  clearInputs();
};

form.addEventListener("submit", handleFormSubmit);
