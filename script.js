const gekozenToppings = [];
const plopGeluid = document.getElementById("plop");
const mammaMiaGeluid = document.getElementById("mammaMia");

const pizzaElement = document.getElementById("pizza");
const resultaatElement = document.getElementById("resultaat");
const klaarKnop = document.querySelector("#knoppen button:first-child");

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();

  const naam = event.dataTransfer.getData("text/plain");
  const element = document.querySelector(`[data-naam="${naam}"]`);
  if (!element) return; // Safety check

  const rect = pizzaElement.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const dx = x - pizzaElement.clientWidth / 2;
  const dy = y - pizzaElement.clientHeight / 2;
  const afstandTotMidden = Math.sqrt(dx * dx + dy * dy);
  if (afstandTotMidden > pizzaElement.clientWidth / 2 - 30) return; // Buiten de pizza

  const nieuweImg = document.createElement("img");
  nieuweImg.src = element.src;
  nieuweImg.alt = naam;
  nieuweImg.style.width = "60px";
  nieuweImg.style.height = "60px";
  nieuweImg.style.position = "absolute";
  nieuweImg.style.cursor = "pointer";
  nieuweImg.style.left = `${x - 30}px`;
  nieuweImg.style.top = `${y - 30}px`;
  nieuweImg.style.transform = `rotate(${Math.random() * 360}deg)`;

  nieuweImg.addEventListener("click", () => {
    nieuweImg.remove();
    const index = gekozenToppings.indexOf(naam);
    if (index !== -1) gekozenToppings.splice(index, 1);
  });

  pizzaElement.appendChild(nieuweImg);
  gekozenToppings.push(naam);

  plopGeluid.currentTime = 0;
  plopGeluid.play();
}

document.querySelectorAll('.ingredient').forEach(item => {
  item.addEventListener('dragstart', event => {
    event.dataTransfer.setData("text/plain", item.dataset.naam);
  });
});

function toonResultaat() {
  if (gekozenToppings.length === 0) {
    resultaatElement.innerText = "Je hebt geen toppings gekozen!";
    return;
  }

  resultaatElement.innerText = "Je pizza wordt gebakken…";
  klaarKnop.disabled = true; // Blokkeer "Klaar!" knop

  mammaMiaGeluid.currentTime = 0;
  mammaMiaGeluid.play();

  setTimeout(() => {
    pizzaElement.classList.add("pizza-gebakken");

    // Sterren
    const sterrenContainer = document.createElement("div");
    sterrenContainer.classList.add("sterren");

    for (let i = 0; i < 15; i++) {
      const ster = document.createElement("div");
      ster.classList.add("ster");
      ster.style.left = `${Math.random() * 100}%`;
      ster.style.top = `${Math.random() * 100}%`;
      ster.style.animationDelay = `${Math.random() * 1.5}s`;
      sterrenContainer.appendChild(ster);
    }

    pizzaElement.appendChild(sterrenContainer);

    resultaatElement.innerText = "✨ Pizza is klaar!";
    klaarKnop.disabled = false; // Activeer knop weer
  }, 3000);
}

function resetPizza() {
  gekozenToppings.length = 0;

  pizzaElement.querySelectorAll("img").forEach(img => img.remove());
  pizzaElement.classList.remove("pizza-gebakken");

  const sterren = pizzaElement.querySelector(".sterren");
  if (sterren) sterren.remove();

  resultaatElement.innerText = "";
}
