(function () {
  console.log("oi");
  const scriptTag = document.currentScript;
  if (!scriptTag) {
    console.error("Não foi possível localizar o currentScript");
    return;
  }
  const id = scriptTag.getAttribute("data-id");
  if (!id) {
    console.error("Não foi possível localizar o id");
    return;
  }

  // Função para criar o botão do widget
  const createWidgetButton = () => {
    const button = document.createElement("button");
    button.id = "widget-button";
    Object.assign(button.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "60px",
      height: "60px",
      border: "none",
      borderRadius: "50%",
      backgroundColor: "#16a34a", // Cor do botão
      color: "#fff",
      cursor: "pointer",
      zIndex: "10001",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      fontSize: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    });
    button.textContent = "+"; // Ícone de "+" no botão
    return button;
  };

  // Função para criar o contêiner do widget e o iframe
  const createWidgetContainer = (id) => {
    const container = document.createElement("div");
    container.id = "iframe-widget-container";
    Object.assign(container.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: "10000",
      border: "none",
      display: "none", // Escondido inicialmente
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      overflow: "hidden", // Evitar transbordamento do iframe
      borderRadius: "8px", // Canto arredondado
    });

    const iframe = document.createElement("iframe");
    iframe.src = "DOMAIN_REPLACE" + "/chatbot?chatbotId=" + id;
    iframe.document = iframe.src;
    Object.assign(iframe.style, {
      width: "100%",
      height: "100%",
      border: "none",
    });

    container.appendChild(iframe);
    return container;
  };

  // Função para ajustar o tamanho do widget com base no tamanho da janela
  const adjustWidgetSize = (container) => {
    const viewportWidth = window.innerWidth;

    if (viewportWidth <= 480) {
      // Telas muito pequenas
      Object.assign(container.style, {
        width: "100%",
        height: "100%",
        bottom: "0px",
        right: "0px",
      });
    } else if (viewportWidth <= 768) {
      // Tablets
      Object.assign(container.style, {
        width: "70%",
        height: "60%",
        bottom: "20px",
        right: "20px",
      });
    } else {
      // Telas maiores
      Object.assign(container.style, {
        width: "400px",
        height: "500px",
        bottom: "20px",
        right: "20px",
      });
    }
  };

  // Função principal para inicializar o widget
  const initializeWidget = () => {
    // Criar os elementos
    const widgetContainer = createWidgetContainer(id);
    const widgetButton = createWidgetButton();

    // Adicionar ao DOM
    document.body.appendChild(widgetContainer);
    document.body.appendChild(widgetButton);

    // Ajustar tamanho inicial do widget
    adjustWidgetSize(widgetContainer);

    // Configurar eventos
    window.addEventListener("resize", () => adjustWidgetSize(widgetContainer));
    widgetButton.addEventListener("click", () => {
      widgetContainer.style.display = "block";
      widgetButton.style.display = "none"; // Esconde o botão enquanto o iframe está aberto
    });

    window.addEventListener("message", (event) => {
      const { action } = event.data;
      if (action === "closeWidget") {
        widgetContainer.style.display = "none";
        widgetButton.style.display = "flex"; // Reexibe o botão
      }
    });
  };

  // Inicializar quando o DOM estiver carregado
  document.addEventListener("DOMContentLoaded", initializeWidget);
})();
