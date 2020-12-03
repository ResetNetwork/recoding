window.addEventListener('load', (event) => {
  const parent = document.getElementById('notion-app');
  const footer = document.createElement("FOOTER");
  const footerInner = document.createElement("DIV");
  footerInner.innerHTML = "<a href='https://recoding.tech/Democracy-in-danger-ce1616459a9d4aedae6997e5b365c106'>Democracy in Danger</a> | <a href='https://recoding.tech/About-7755d738441b41d3bf29dc2a679e0a9a'>About</a> | <a href='https://recoding.tech/Newsletter-6811176fe2694575b886cbd9153227be'>Newsletter</a> | <a href='mailto:hello@recoding.tech'>hello@recoding.tech</a>"
  footer.appendChild(footerInner);
  document.body.appendChild(footer);
});
