import webGL from "./webgl";
import "../scss/app.scss";

window.addEventListener("DOMContentLoaded", () => {
  const app = new webGL();
  app.init();
});
