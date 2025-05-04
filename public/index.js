<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Narion spricht</title>
</head>
<body>
  <h1>Narions Stimme</h1>
  <input id="text" type="text" placeholder="Was soll Narion sagen?" />
  <button onclick="sendText()">Sprechen</button>

  <script>
    const socket = new WebSocket(`wss://${location.host}`);

    socket.onopen = () => {
      console.log("WebSocket verbunden.");
    };

    socket.onmessage = (event) => {
      const audio = new Audio(URL.createObjectURL(new Blob([event.data])));
      audio.play();
    };

    function sendText() {
      const text = document.getElementById('text').value;
      fetch('/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
    }
  </script>
</body>
</html>
