# Login werkend krijgen op je GSM

Hieronder vind je de belangrijkste stappen om de login van je project werkend te krijgen op je mobiele telefoon:

---

###  1. Local IP gebruiken i.p.v. `localhost`

Vervang in je frontend:

```js
axios.post('http://localhost:5000/api/login', ...)
```

door:

```js
const baseURL = 'http://192.168.0.50:5000'; // ← jouw computer's IP-adres
axios.post(`${baseURL}/api/login`, ...)
```

---

###  2. Zorg dat backend luistert op alle netwerken

In je `server.js` of `app.js`:

```js
app.listen(5000, '0.0.0.0', () => {
  console.log('Server running...');
});
```

Dit zorgt ervoor dat andere toestellen (zoals je GSM) verbinding kunnen maken.

---

###  3. Zorg dat frontend via netwerk bereikbaar is

Start je React app met:

```bash
npm run dev
```

Vite toont je dan bijvoorbeeld:

```
➜  Network: http://192.168.0.50:5173/
```

Open die URL op je GSM via de browser (als beide op hetzelfde wifi-netwerk zitten).

---

###  4. Geen firewall/blokkades

Zorg dat je Windows firewall of antivirus geen inkomend verkeer blokkeert op poort `5000`.

---

Succes! 🚀 