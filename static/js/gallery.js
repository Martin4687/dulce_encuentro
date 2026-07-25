// Galería interactiva construida en React puro (sin JSX ni bundler),
// usando React.createElement directamente. Se monta sobre el
// <div id="galeria-react-root"> que Flask ya dejó en el HTML,
// y consume datos desde la API JSON que expone Flask en /api/galeria.
//
// La idea de mostrar esto en el portafolio: el backend (Flask) y el
// frontend (React) están completamente separados y se comunican solo
// por HTTP + JSON — el mismo patrón que se usa en aplicaciones grandes.

const e = React.createElement;

const CATEGORIAS = ["todos", "sabores", "sucursal", "promos"];
const ETIQUETAS = {
  todos: "Todos",
  sabores: "Sabores",
  sucursal: "Sucursal",
  promos: "Promos",
};

function Galeria({ apiUrl }) {
  const [items, setItems] = React.useState([]);
  const [filtro, setFiltro] = React.useState("todos");
  const [seleccionado, setSeleccionado] = React.useState(null);
  const [cargando, setCargando] = React.useState(true);

  React.useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, [apiUrl]);

  if (cargando) {
    return e("p", { className: "galeria-fallback" }, "Cargando galería…");
  }

  const visibles =
    filtro === "todos" ? items : items.filter((item) => item.categoria === filtro);

  const filtros = e(
    "div",
    { className: "gal-filters" },
    CATEGORIAS.map((cat) =>
      e(
        "button",
        {
          key: cat,
          className: "gal-filter-btn" + (filtro === cat ? " is-active" : ""),
          onClick: () => setFiltro(cat),
        },
        ETIQUETAS[cat]
      )
    )
  );

  const grid = e(
    "div",
    { className: "gal-grid" },
    visibles.map((item) =>
      e(
        "button",
        {
          key: item.id,
          className: "gal-item",
          onClick: () => setSeleccionado(item),
        },
        e("img", { src: item.imagen, alt: item.titulo, loading: "lazy" }),
        e("span", { className: "gal-item__caption" }, item.titulo)
      )
    )
  );

  const lightbox = seleccionado
    ? e(
        "div",
        { className: "gal-lightbox", onClick: () => setSeleccionado(null) },
        e(
          "div",
          {
            className: "gal-lightbox__card",
            onClick: (ev) => ev.stopPropagation(),
          },
          e(
            "button",
            {
              className: "gal-lightbox__close",
              onClick: () => setSeleccionado(null),
              "aria-label": "Cerrar",
            },
            "\u00D7"
          ),
          e("img", { src: seleccionado.imagen, alt: seleccionado.titulo }),
          e(
            "div",
            { className: "gal-lightbox__body" },
            e("h3", null, seleccionado.titulo),
            e("p", null, seleccionado.descripcion)
          )
        )
      )
    : null;

  return e("div", null, filtros, grid, lightbox);
}

const rootEl = document.getElementById("galeria-react-root");
if (rootEl) {
  const apiUrl = rootEl.dataset.api;
  const root = ReactDOM.createRoot(rootEl);
  root.render(e(Galeria, { apiUrl }));
}
