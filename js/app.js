$(document).ready(function () {
  cardapio.eventos.init();
});

var cardapio = {};

var MEU_CARRINHO = [];

cardapio.eventos = {
  init: () => {
    cardapio.metodos.obterItensCardapio();
  },
};

cardapio.metodos = {
  //obtem a lista de itens do cardápio
  obterItensCardapio: (categoria = "burgers", vermais = false) => {
    var filtro = MENU[categoria];
    console.log(filtro);

    if (!vermais) {
      $("#itensCardapio").html("");
      $("#btnVerMais").removeClass("hidden");
    }

    $.each(filtro, (i, e) => {
      let temp = cardapio.templetes.item
        .replace(/\${img}/g, e.img)
        .replace(/\${name}/g, e.name)
        .replace(/\${price}/g, e.price.toFixed(2).replace(".", ","))
        .replace(/\${id}/g, e.id);

      //btn ver mais clicado (12 itens)
      if (vermais && i >= 8 && i < 12) {
        $("#itensCardapio").append(temp);
      }

      //paginação inicial(8 itens)
      if (!vermais && i < 8) {
        $("#itensCardapio").append(temp);
      }
    });

    //remover active
    $(".container-menu a").removeClass("active");

    //Add o menu atual como active
    $("#menu-" + categoria).addClass("active");
  },

  //Click do button ver mais
  verMais: () => {
    var ativo = $(".container-menu a.active").attr("id").split("menu-")[1];
    cardapio.metodos.obterItensCardapio(ativo, true);

    $("#btnVerMais").addClass("hidden");
  },

  //diminuir a quantidade do item/produto a ser inserido no carrinho
  diminuirQuantidade: (id) => {
    let qntdAtual = parseInt($("#qntd-" + id).text());

    if (qntdAtual > 0) {
      $("#qntd-" + id).text(qntdAtual - 1);
    }
  },

  //Aumentar a quantidade do item/produto a ser inserido no carrinho
  aumentarQuantidade: (id) => {
    let qntdAtual = parseInt($("#qntd-" + id).text());
    $("#qntd-" + id).text(qntdAtual + 1);
  },

  //Adicionar no carrinho o item do cardápio
  adicionarAoCarrinho: (id) => {
    let qntdAtual = parseInt($("#qntd-" + id).text());
    if (qntdAtual > 0) {
      //obter a categoria ativa
      var categoria = $(".container-menu a.active")
        .attr("id")
        .split("menu-")[1];

      //Obtenha a lista de itens
      let filtro = MENU[categoria];

      //Obter o item
      let item = $.grep(filtro, (e, i) => {
        return e.id == id;
      });

      if (item.length > 0) {
        //validar se já existe esse item no carrinho
        let existe = $.grep(MEU_CARRINHO, (elem, index) => {
          return elem.id == id;
        });

        //caso tenha o item/produto só incrementa a quantidade
        if (existe.length > 0) {
          let objIndex = MEU_CARRINHO.findIndex((obj) => obj.id == id);
          MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
        }
        //caso n exista o item no carrinho add o item/produto
        else {
          item[0].qntd = qntdAtual;
          MEU_CARRINHO.push(item[0]);
        }

        cardapio.metodos.mensagem("Item adicionado ao carrinho", "green");
        $("#qntd-" + id).text(0);

        cardapio.metodos.atualizarBadgeTotal();
      }
    }
  },

  //Atualiza o badge de totais dos botões "Meu carrinho"
  atualizarBadgeTotal: () => {
    var total = 0;

    $.each(MEU_CARRINHO, (i, e) => {
      total += e.qntd;
    });

    if (total > 0) {
      $(".botao-carrinho").removeClass("hidden");
      $(".container-total-carrinho").removeClass("hidden");
    } else {
      $(".botao-carrinho").addClass("hidden");
      $(".container-total-carrinho").addClass("hidden");
    }
    $(".badge-total-carrinho").html(total);
  },

  //Abrir a modal de carrinho
  abrirCarrinho: (abrir) => {
    if (abrir) {
      $("#modalCarrinho").removeClass("hidden");
      cardapio.metodos.carregarEtapa(1);
    } else {
      $("#modalCarrinho").addClass("hidden");
    }
  },

  //Altera os textos e exibe os botões das etapas
  carregarEtapa: (etapa) => {
    if (etapa == 1) {
      $("#ldlTituloEtapa").text("Seu carrinho:");
      $("#itensCarrinho").removeClass("hidden");
      $("#localEntrega").addClass("hidden");
      $("#resumeCarrinho").addClass("hidden");

      $(".etapa").removeClass("active");
      $(".etapa1").addClass("active");

      $("#btnEtapaPedido").removeClass("hidden");
      $("#btnEtapaEndereco").addClass("hidden");
      $("#btnEtapaResumo").addClass("hidden");
      $("#btnVoltar").addClass("hidden");
    }
    if (etapa == 2) {
      $("#ldlTituloEtapa").text("Endereço de entrega:");
      $("#itensCarrinho").addClass("hidden");
      $("#localEntrega").removeClass("hidden");
      $("#resumeCarrinho").addClass("hidden");

      $(".etapa").removeClass("active");
      $(".etapa1").addClass("active");
      $(".etapa2").addClass("active");

      $("#btnEtapaPedido").addClass("hidden");
      $("#btnEtapaEndereco").removeClass("hidden");
      $("#btnEtapaResumo").addClass("hidden");
      $("#btnVoltar").removeClass("hidden");
    }
    if (etapa == 3) {
      $("#ldlTituloEtapa").text("Resumo do pedido:");
      $("#itensCarrinho").addClass("hidden");
      $("#localEntrega").addClass("hidden");
      $("#resumeCarrinho").removeClass("hidden");

      $(".etapa").removeClass("active");
      $(".etapa1").addClass("active");
      $(".etapa2").addClass("active");
      $(".etapa3").addClass("active");

      $("#btnEtapaPedido").addClass("hidden");
      $("#btnEtapaEndereco").addClass("hidden");
      $("#btnEtapaResumo").removeClass("hidden");
      $("#btnVoltar").removeClass("hidden");
    }
  },

  //Botão de volta etapa
  voltarEtapa: () => {
    let etapa = $(".etapa.active").length;
    cardapio.metodos.carregarEtapa(etapa - 1);
  },

  //mensagens
  mensagem: (texto, cor = "red", tempo = 3500) => {
    let id = Math.floor(Date.now() * Math.random()).toString(); //criando um id

    let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

    $("#container-mensagens").append(msg);

    setTimeout(() => {
      $("#msg-" + id).removeClass("fadeInDown");
      $("#msg-" + id).addClass("fadeOutUp");
      setTimeout(() => {
        $("#msg-" + id).remove();
      }, 800);
    }, tempo);
  },
};

cardapio.templetes = {
  item: `
        <div class="col-3 mb-5">
          <div class="card card-item" id="\${id}">
            <div class="img-produto">
              <img src="\${img}"/>
            </div>
            <p class="title-produto text-center mt-4">
              <b>\${name}</b>
            </p>
            <p class="price-producto text-center">
              <b>R$ \${price}</b>
            </p>
            <div class="add-carrinho">
              <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
              <span class="add-numero-itens" id="qntd-\${id}">0</span>
              <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
              <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
            </div>
          </div>
        </div>
  `,
};
