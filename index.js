// Uppdaterat till REST Countries API version 5 (2026).
// API:et kräver numera en egen API-nyckel.
// Hämta en gratis nyckel på https://restcountries.com/ och ersätt texten nedan.
// CORS? (Cross-Origin Resource Sharing)
// OBS! En API-nyckel i JavaScript syns för den som öppnar webbsidan.
// Detta är därför bara lämpligt som en lokal övning, inte för en publik webbplats.

// Adressen till API:et där vi hämtar information om länder.
const countriesAPI = "https://api.restcountries.com/countries/v5";

// API-nyckeln används för att få tillgång till API:et.
// Ersätt texten med din egen API-nyckel.
const apiKey = "YOUR_API_KEY_HERE";

// Variabel som ska innehålla det totala antalet länder.
let totalCountries = 0;

// Funktionen hämtar alla länder från API:et.
// async gör att vi kan använda await för att vänta på API-anrop.
const showCountries = async () => {
  try {
    // Här sparar vi alla länder som hämtas från API:et.
    // Vi börjar med en tom array.
    let allCountries = [];

    // offset bestämmer var i listan vi ska börja hämta.
    // 0 betyder att vi börjar från första landet.
    let offset = 0;

    // Denna variabel bestämmer om vi ska fortsätta hämta länder.
    let moreCountries = true;

    // Loopen fortsätter så länge moreCountries är true.
    // Vi hämtar maximalt 100 länder per API-anrop.
    while (moreCountries) {
      // Bygger adressen till API:et.
      // limit=100 betyder att vi vill hämta 100 länder.
      // offset bestämmer var hämtningen ska börja.
      // response_fields anger att vi bara vill ha ländernas namn.
      const url = `${countriesAPI}?limit=100&offset=${offset}&response_fields=names.common`;

      // fetch skickar ett HTTP-anrop till API:et.
      // await gör att vi väntar på svaret innan vi fortsätter.
      // API-nyckeln skickas med i HTTP-headern.
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      // Kontrollerar om API-anropet lyckades.
      // response.ok är true om HTTP-status är 200–299.
      if (!response.ok) {
        // Om anropet misslyckades skapar vi ett felmeddelande.
        // throw avbryter körningen och skickar felet till catch.
        throw new Error(
          `API-anropet misslyckades (HTTP ${response.status}). Kontrollera din API-nyckel.`,
        );
      }

      // Omvandlar JSON-svaret från API:et till ett JavaScript-objekt.
      const result = await response.json();

      // Hämtar arrayen med länder från JSON-svaret.
      const countries = result.data.objects;

      // Lägger till de nya länderna i vår befintliga array.
      // concat slår ihop två arrayer.
      allCountries = allCountries.concat(countries);

      // Kontrollerar om API:et har fler länder att hämta.
      // Om more är true fortsätter while-loopen.
      // Om more är false avslutas loopen.
      moreCountries = result.data.meta.more;

      // Flyttar fram startpositionen med 100.
      // Första anropet: offset = 0   (land 1–100)
      // Andra anropet: offset = 100 (land 101–200)
      // Tredje anropet: offset = 200 (nästa 100 länder)
      offset += 100;
    }

    // När loopen är klar räknar vi antalet hämtade länder.
    totalCountries = allCountries.length;

    // Visar det totala antalet länder på webbsidan.
    showNumberOfCountries(totalCountries);

    // Skickar alla hämtade länder till funktionen som visar dem.
    showData(allCountries);
  } catch (error) {
    // Om något går fel hamnar vi här.
    // Skriver ut felet i webbläsarens Console.
    console.error(error);

    // Skapar ett nytt HTML-element av typen <p>.
    const errorMessage = document.createElement("p");

    // Lägger in felmeddelandet i elementet.
    errorMessage.textContent = `Kunde inte hämta länderna: ${error.message}`;

    // Centrerar texten.
    errorMessage.style.textAlign = "center";

    // Lägger till felmeddelandet på webbsidan.
    document.body.appendChild(errorMessage);
  }
};

// Funktionen visar alla länder på webbsidan.
// Parametern data innehåller vår array med länder.
function showData(data) {
  // Skapar ett nytt div-element som ska innehålla alla länder.
  let countryContainer = document.createElement("div");

  // Kopplar CSS-klassen country-container till elementet.
  countryContainer.className = "country-container";

  // Lägger till vår container på webbsidan.
  document.body.appendChild(countryContainer);

  // Går igenom alla länder i arrayen.
  // forEach kör koden en gång för varje land.
  data.forEach((country) => {
    // Skapar ett nytt div-element för landet.
    const countryText = document.createElement("div");

    // Hämtar landets namn från objektet.
    // names.common innehåller landets vanliga namn.
    countryText.textContent = country.names.common;

    // Kopplar en CSS-klass till elementet.
    countryText.className = "country-text";

    // Lägger till landet i vår container.
    countryContainer.appendChild(countryText);
  });
}

// Funktionen skapar sidans huvudrubrik.
function showTitle() {
  // Skapar ett nytt div-element.
  let title = document.createElement("div");

  // Bestämmer vilken text som ska visas.
  title.textContent = "World Countries List";

  // Ändrar textens storlek.
  title.style.fontSize = "40px";

  // Centrerar rubriken.
  title.style.textAlign = "center";

  // Gör texten fet.
  title.style.fontWeight = "bold";

  // Lägger till ett mellanrum ovanför rubriken.
  title.style.marginTop = "40px";

  // Lägger till rubriken på webbsidan.
  document.body.appendChild(title);
}

// Funktionen visar hur många länder som har hämtats.
// Parametern totalCountries innehåller antalet länder.
function showNumberOfCountries(totalCountries) {
  // Skapar ett nytt div-element.
  let numberOfCountries = document.createElement("div");

  // Visar antalet länder med hjälp av en template literal.
  numberOfCountries.textContent = `Total number of countries: ${totalCountries}`;

  // Bestämmer textens utseende.
  numberOfCountries.style.fontSize = "30px";
  numberOfCountries.style.textAlign = "center";
  numberOfCountries.style.fontWeight = "bold";
  numberOfCountries.style.marginTop = "10px";

  // Lägger till elementet på webbsidan.
  document.body.appendChild(numberOfCountries);
}

// Startar programmet genom att visa sidans rubrik.
showTitle();

// Hämtar alla länder från API:et och visar dem på sidan.
showCountries();
