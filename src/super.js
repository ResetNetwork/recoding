window.addEventListener('load', (event) => {
  const parent = document.getElementById('notion-app');
  const footer = document.createElement("FOOTER");
  const footerInner = document.createElement("DIV");
  footerInner.innerHTML = "<a href='https://recoding.tech'>Home</a> | <a href='mailto:hello@recoding.tech'>hello@recoding.tech</a>"
  footer.appendChild(footerInner);
  document.body.appendChild(footer);
});
