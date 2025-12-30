const list = document.getElementById("list");
const totalEl = document.getElementById("grandTotal");
const currencySelect = document.getElementById("currency");
const budgetInput = document.getElementById("budget");

let currency = localStorage.getItem("currency") || "₱";

currencySelect.value = currency;

function addItem() {
  const name = nameInput.value;
  const qty = Number(qtyInput.value);
  const price = Number(priceInput.value);

  if (!name || qty <= 0 || price < 0) return alert("Invalid input");

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${name}</td>
    <td><input type="number" value="${qty}" min="1" onchange="recalc(this)"></td>
    <td><input type="number" value="${price}" min="0" step="0.01" onchange="recalc(this)"></td>
    <td class="item-total"></td>
    <td><button onclick="removeItem(this)">❌</button></td>
  `;

  list.appendChild(row);
  recalc(row.querySelector("input"));
  saveData();

  nameInput.value = qtyInput.value = priceInput.value = "";
}

function recalc(input) {
  const row = input.closest("tr");
  const qty = Number(row.children[1].querySelector("input").value);
  const price = Number(row.children[2].querySelector("input").value);
  const total = qty * price;

  row.querySelector(".item-total").textContent =
    currency + total.toFixed(2);

  updateGrandTotal();
  saveData();
}

function removeItem(btn) {
  if (!confirm("Remove this item?")) return;
  btn.closest("tr").remove();
  updateGrandTotal();
  saveData();
}

function resetList() {
  if (!confirm("Clear all items?")) return;
  list.innerHTML = "";
  updateGrandTotal();
  saveData();
}

function updateCurrency() {
  currency = currencySelect.value;
  localStorage.setItem("currency", currency);
  updateGrandTotal();
}

function updateGrandTotal() {
  let sum = 0;
  document.querySelectorAll(".item-total").forEach(td => {
    sum += Number(td.textContent.replace(currency, ""));
  });

  if (document.getElementById("taxToggle").checked) {
    sum *= 1.12;
  }

  totalEl.textContent = `Total: ${currency}${sum.toFixed(2)}`;

  const budget = Number(budgetInput.value);
  totalEl.classList.toggle("over-budget", budget && sum > budget);
}

function saveData() {
  localStorage.setItem("shoppingData", list.innerHTML);
  localStorage.setItem("budget", budgetInput.value);
}

function loadData() {
  list.innerHTML = localStorage.getItem("shoppingData") || "";
  budgetInput.value = localStorage.getItem("budget") || "";
  updateGrandTotal();
}

window.onload = loadData;

// Enter key support
document.addEventListener("keydown", e => {
  if (e.key === "Enter") addItem();
});
