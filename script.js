const list = document.getElementById("list");
const grandTotalEl = document.getElementById("grandTotal");

function addItem() {
  const name = document.getElementById("name").value;
  const qty = Number(document.getElementById("qty").value);
  const price = Number(document.getElementById("price").value);

  if (!name || qty <= 0 || price < 0) {
    alert("Please enter valid values");
    return;
  }

  const total = qty * price;

  row.innerHTML = `
  <td>${name}</td>
  <td><input type="number" value="${qty}" min="1" onchange="recalc(this)"></td>
  <td><input type="number" value="${price}" min="0" step="0.01" onchange="recalc(this)"></td>
  <td class="item-total">₱${total.toFixed(2)}</td>
  <td><button onclick="removeItem(this)">❌</button></td>
`;


  list.appendChild(row);
  updateGrandTotal();

  // Clear inputs
  document.getElementById("name").value = "";
  document.getElementById("qty").value = "";
  document.getElementById("price").value = "";

  saveData();
}

function removeItem(btn) {
  if (!confirm("Remove this item?")) return;
  btn.closest("tr").remove();
  updateGrandTotal();

  saveData();
}


function updateGrandTotal() {
  let sum = 0;
  document.querySelectorAll(".item-total").forEach(td => {
    sum += Number(td.textContent.replace("₱", ""));
  });
  grandTotalEl.textContent = sum.toFixed(2);
}

function resetList() {
  if (!confirm("Clear all items?")) return;
  list.innerHTML = "";
  updateGrandTotal();
}

function recalc(input) {
  const row = input.closest("tr");
  const qty = Number(row.children[1].querySelector("input").value);
  const price = Number(row.children[2].querySelector("input").value);
  const totalCell = row.querySelector(".item-total");

  const total = qty * price;
  totalCell.textContent = "₱" + total.toFixed(2);

  updateGrandTotal();
  saveData();
}

function saveData() {
  localStorage.setItem("shoppingList", list.innerHTML);
}

function loadData() {
  const saved = localStorage.getItem("shoppingList");
  if (saved) {
    list.innerHTML = saved;
    updateGrandTotal();
  }
}

document.addEventListener("keydown", e => {
  if (e.key === "Enter") addItem();
});

