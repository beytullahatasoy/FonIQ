const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

// Fon listesi
app.get("/api/funds", async (req, res) => {
  try {
    const response = await fetch(
      "https://www.tefas.gov.tr/api/DB/BindFundBasket",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: "https://www.tefas.gov.tr/",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: "fontip=YAT&bastarih=2026-03-13&bittarih=2026-03-13",
      },
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () =>
  console.log("FonIQ Backend çalışıyor: http://localhost:3000"),
);
