// function downloadJSON(jsonData) {
    // const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonData);
    // const downloadLink = document.createElement("a");
    // downloadLink.setAttribute("href", dataStr);
    // downloadLink.setAttribute("download", "meu_arquivo.json");
    // document.body.appendChild(downloadLink);
    // downloadLink.click();
    // document.body.removeChild(downloadLink);
// }

function exportarJSON() {
    const jsonSalvo = localStorage.getItem('meusDados');
    const jsonComQuebrasDeLinha = jsonSalvo.replace(/\\n/g, '\r\n'); // Ou '\n'
    const bytes = new TextEncoder().encode(jsonComQuebrasDeLinha);
    const blob = new Blob([bytes], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `meus_dados_de_treino_ts_${Date.now()}.json`;
    link.click();
}

/**
 * Somente quando houver alterações no json
 * */
function ajustarProblemasNosJSON() {

    // let exerciciosCadastrados = JSON.parse(localStorage.getItem('exerciciosCadastrados')) || [];
    // exerciciosCadastrados.forEach(exercicioCadastrado => {
    //     delete exercicioCadastrado['nomeId'];
    // });
    // localStorage.setItem('exerciciosCadastrados', JSON.stringify(exerciciosCadastrados));

    const meusDados = JSON.parse(localStorage.getItem('meusDados')) || [];
    // meusDados.forEach(umDado => {
        // mudarCampoPrimeiroNivelDeUmRotuloParaOutroRotulo(umDado, 'nome', 'exercicio');
    // });
    localStorage.setItem('meusDados', JSON.stringify(meusDados, null, 2));
}

function mudarCampoPrimeiroNivelDeUmRotuloParaOutroRotulo(objeto, nomeAntigo, nomeAtual) {
    if (nomeAntigo in objeto) {
        objeto[nomeAtual] = objeto[nomeAntigo];
        delete objeto[nomeAntigo];
    }
}

function criarFichaDeTreino(index) {
    const novaDiv = document.createElement('div');
    if( !index ) {
        index = 1;
        document.getElementById("botaoAdicionarFichaDeTreino").style.display = "none";
    }
    else if ( index >= 1) {
        document.getElementById('botaoMaisDo'+(index-1)).style.display = "none";
        document.getElementById('botaoMenosDo'+(index-1)).style.display = "none";
        let selectAnterior = document.getElementById('seldivTreino'+(index-1));
        selectAnterior.classList.add('comprimirSelectExerciciosCadastrados');
    }
    novaDiv.id = 'divTreino'+index;
    novaDiv.className = 'divFichaTreino';
    const divPai = document.getElementById('divFichasDeTreino');
    divPai.appendChild(novaDiv);
    criarBotaoNoElementoComAcaoComID(novaDiv, 'botaoMaisDo'+index, '+1 Ficha', 'botaoAdicionarExecucaoDeTreinoEspecifico maisUmaFichaDeTreino', criarFichaDeTreino, index+1);
    criarBotaoNoElementoComAcaoComID(novaDiv, 'botaoMenosDo'+index, '-1 Ficha', 'botaoExcluirRegistroDeTreino menosUmaFichaDeTreino', removerFichaDeTreino, index);

    let lista = document.createElement('ul');
    lista.id = "listaExerciciosDaFicha"+index;
    lista.className = 'listagemDeExerciciosDaFicha';
    novaDiv.appendChild(lista);

    let inputNome = document.createElement('input');
    inputNome.id = "inputNomeDaFicha"+index;
    inputNome.type = 'text';
    inputNome.className = 'inputNomeDaFicha';
    inputNome.placeholder = 'Digite o nome desta ficha';
    novaDiv.appendChild(inputNome);

    criarBotaoNoElementoComAcaoComID(novaDiv, 'botaoIncluirExercicioNaFicha'+index, '+1', 'botaoAdicionarExecucaoDeTreinoEspecifico adicionarExerciciosNaFichaDeTreino', incluirExercicioNaFicha, index);
    const elementoSelect = preencherComboDeExercicios().cloneNode(true);
    elementoSelect.id = 'sel'+novaDiv.id;
    elementoSelect.className = 'selectExerciciosCadastrados';
    novaDiv.appendChild(elementoSelect);

    document.getElementById("botaoSalvarFichaDeTreino").style.display = '';
    const gridContainer = document.getElementById('divFichasDeTreino');
    const numItens = gridContainer.children.length;
    let numCols = Math.ceil(Math.sqrt(numItens));
    let numRows = Math.ceil(numItens / numCols);
    gridContainer.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
}

function removerFichaDeTreino(index) {
    document.getElementById('divTreino'+index).remove();
    if (index == '1') {
        document.getElementById("botaoAdicionarFichaDeTreino").style.display = "";
        document.getElementById("botaoSalvarFichaDeTreino").style.display = 'none';
        document.getElementById('divTreino'+index).remove();
    }
    else {
        document.getElementById('botaoMaisDo'+(index-1)).style.display = "";
        document.getElementById('botaoMenosDo'+(index-1)).style.display = "";
        let selectAnterior = document.getElementById('seldivTreino'+(index-1));
        selectAnterior.classList.remove('comprimirSelectExerciciosCadastrados');
    }

    const gridContainer = document.getElementById('divFichasDeTreino');
    const numItens = gridContainer.children.length;
    let numCols = Math.ceil(Math.sqrt(numItens));
    let numRows = Math.ceil(numItens / numCols);
    gridContainer.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
}

function incluirExercicioNaFicha(index) {
    let lista = document.getElementById('listaExerciciosDaFicha'+index);
    const li = document.createElement('li');
    li.innerHTML = `<strong>${document.getElementById('seldivTreino'+index).value}</strong>`;
    lista.appendChild(li);
}

function salvarFichasDeTreino() {

    const divFichas = document.getElementById("divFichasDeTreino");
    minhasFichas = [];
    if (divFichas) {
        const divsFilhas = divFichas.querySelectorAll("div");
        divsFilhas.forEach(div => {
            const ul = div.querySelector("ul");
            if (ul) {
                const itens = ul.querySelectorAll("li");
                const conteudo = [];
                itens.forEach(li => {
                    const strong = li.querySelector("strong");
                    if (strong) {
                        conteudo.push(strong.textContent);
                    }
                });
                input = div.querySelector("input");
                minhasFichas.push({nome: input.value, treino: conteudo});
            }
        });
        localStorage.setItem('minhasFichas', JSON.stringify(minhasFichas, null, 2));
        apresentarDivAlvo('divConfiguracaoDeTreino');
    }
    else {
        console.log("Elemento divFichasDeTreino não encontrado.");
    }

}

function excluirFichasDeTreino() {
    if (confirm("Tem certeza que deseja excluir TODAS as fichas de treino?")) {
        localStorage.removeItem('minhasFichas');
        apresentarDivAlvo('divConfiguracaoDeTreino');
    }
}

function exibirFichasDeTreino() {
    const divFichas = document.getElementById("divFichasDeTreino");
    divFichas.innerHTML = '';
    divFichas.style.gridTemplateColumns = `repeat(1, 1fr)`;
    divFichas.style.gridTemplateColumns = `repeat(1, 1fr)`;

    if (divFichas) {
        const minhasFichas = localStorage.getItem('minhasFichas');

        if (minhasFichas) {
            const fichas = JSON.parse(minhasFichas);
            fichas.forEach(ficha => {
                const divFicha = document.createElement('div');
                divFicha.id = ficha.nome;
                divFicha.className = 'divFichaTreinoApresentacao';

                const tituloFicha = document.createElement('h3');
                tituloFicha.textContent = ficha.nome;
                divFicha.appendChild(tituloFicha);

                const ulTreino = document.createElement('ul');
                ficha.treino.forEach(exercicio => {
                    const liExercicio = document.createElement('li');
                    liExercicio.textContent = exercicio;
                    ulTreino.appendChild(liExercicio);
                });
                divFicha.appendChild(ulTreino);
                divFichas.appendChild(divFicha);
            });

            const gridContainer = document.getElementById('divFichasDeTreino');
            const numItens = gridContainer.children.length;
            let numCols = Math.ceil(Math.sqrt(numItens));
            let numRows = Math.ceil(numItens / numCols);
            gridContainer.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;
            gridContainer.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;

        }
    }

}

function ajustarApresentacaoDeBotoesDaCriacaoDeFicha() {

    const divFichas = document.getElementById("divFichasDeTreino"); //depende da montage das divs e nao do storage
    if (divFichas) {
        const divsFilhas = divFichas.querySelectorAll("div");
        if (divsFilhas.length >= 1) {
            document.getElementById("botaoAdicionarFichaDeTreino").style.display = 'none';
        }
        else {
            document.getElementById("botaoAdicionarFichaDeTreino").style.display = '';
        }
    }

    const minhasFichas = localStorage.getItem('minhasFichas');
    if (minhasFichas) {
        document.getElementById("botaoExcluirFichaDeTreino").style.display = '';
        document.getElementById("botaoAdicionarFichaDeTreino").style.display = 'none';
        document.getElementById("botaoSalvarFichaDeTreino").style.display = 'none';
    }
    else {
        document.getElementById("botaoExcluirFichaDeTreino").style.display = 'none';
        document.getElementById("botaoSalvarFichaDeTreino").style.display = 'none';
    }

}

function adicionarRegistroDeExecucao() {
    const index = document.getElementById('index').value;
    let exercicio = document.getElementById('exercicio').value;
    const carga = document.getElementById('carga').value;
    const intensidade = document.getElementById('intensidade').value;

    let exerciciosCadastrados = JSON.parse(localStorage.getItem('exerciciosCadastrados')) || [];
    exerciciosCadastrados.forEach(exercicioCadastrado => {
        if ( exercicioCadastrado.nomeDoExercicio.trim().toLowerCase() == document.getElementById('exercicio').value.trim().toLowerCase() ) {
            exercicio = exercicioCadastrado.nomeDoExercicio;
        }
    });

    let meusDados = JSON.parse(localStorage.getItem('meusDados')) || [];

    if (index) {
        let itemAlvo = meusDados[index];
        itemAlvo.exercicio = exercicio.trim();
        itemAlvo.carga = carga;
        itemAlvo.intensidade = intensidade;
        meusDados[index] = itemAlvo;
    }
    else {
        const timestampDoExercicio = Date.now();
        const novoRegistro = { exercicio, carga, intensidade, timestampDoExercicio };
        meusDados.unshift(novoRegistro);
    }

    localStorage.setItem('meusDados', JSON.stringify(meusDados, null, 2));
    apresentarDivAlvo('divTreinos');
}

function limparCamposNaTela() {
    document.getElementById('exercicio').value = ''
    document.getElementById('carga').value = ''
    document.getElementById('intensidade').value = ''
    document.getElementById('index').value = ''
}

function alterarExibicaoConformeTamanhoDaTabela(isTabelaVazia) {
    if (isTabelaVazia) {
        document.getElementById('tabelaTreinos').style.display = 'none';
        document.getElementById('mensagem').textContent = 'Você ainda não possui registros de treinos.';        
        document.getElementById('divTabelaTreinos').classList.add('encolherDiv');
    }
    else {
        document.getElementById('tabelaTreinos').removeAttribute('style');
        document.getElementById('mensagem').textContent = '';  
        document.getElementById('divTabelaTreinos').classList.remove('encolherDiv');
    }
}

function criarTabelaHTMLParaApresentacaoDosDadosDosTreinosPassados(meusDados, isApresentacaoDefault) {
    const tabela = document.getElementById('tabelaTreinos').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';
    meusDados.forEach((registro, index) => {
        const novaLinha = tabela.insertRow();
        const celulaExercicio = novaLinha.insertCell();
        const celulaCarga = novaLinha.insertCell();
        const celulaIntensidade = novaLinha.insertCell();
        const celulaDataHoraExercicio = novaLinha.insertCell();

        celulaExercicio.textContent = registro.exercicio;
        celulaCarga.textContent = registro.carga;
        celulaIntensidade.textContent = identificarEmojiDeIntensidadeDoExercicio(registro.intensidade);
        celulaDataHoraExercicio.textContent = converterTimestampParaFormatacaoDataEHora(registro.timestampDoExercicio);

        if (isApresentacaoDefault) {
            const celulaAcoes = novaLinha.insertCell();
            criarBotaoNoElementoComAcao(celulaAcoes, '\u{1F4DD}', 'botaoEditarExecucaoDeTreinoEspecifico', editarExecucaoDeTreinoEspecifico, index);
            criarBotaoNoElementoComAcao(celulaAcoes, '+', 'botaoAdicionarExecucaoDeTreinoEspecifico', adicionarExecucaoDeTreinoEspecifico, index);
            criarBotaoNoElementoComAcao(celulaAcoes, '\u{231B}', 'botaoPesquisarExecucoesAnterioresDoTreino', pesquisarExecucoesAnterioresDoTreino, index);
            criarBotaoNoElementoComAcao(celulaAcoes, '\u{1F5D1}', 'botaoExcluirRegistroDeTreino', excluirRegistro, index);
        }
        else {
            document.getElementById("botaoExecucaoEspecifica").style.display = "";
            document.getElementById("botaoExecucaoGenerica").style.display = "none";
            document.getElementById("botaoVoltarNoHistoricoDeTreino").style.display = "";
        }

    });
}

function criarBotaoNoElementoComAcaoComID(elementoPai, id, texto, classe, funcaoDoBotao, argumentoDaFuncao) {
    criarBotaoNoElementoComAcao(elementoPai, texto, classe, funcaoDoBotao, argumentoDaFuncao)
    elementoPai.lastElementChild.id=id;
}

function criarBotaoNoElementoComAcao(elementoPai, texto, classes, funcaoDoBotao, argumentoDaFuncao) {
    const botao = document.createElement('button');
    botao.textContent = texto;

    if (classes.includes(" ")) {
        const classesArray = classes.split(" ");
        classesArray.forEach(classe => {
          botao.classList.add(classe);
        });
    }
    else {
        botao.classList.add(classes);
    }


    botao.onclick = () => {
        funcaoDoBotao(argumentoDaFuncao);
    };
    elementoPai.appendChild(botao);
}

function converterTimestampParaFormatacaoDataEHora(timestamp) {
    if (timestamp) {
        const data = new Date(timestamp);
        const options = {
            weekday: "long",
            month: "long",
            day: "numeric",
            dayPeriod: "long",
        };
        const dataFormatadaPersonalizada = data.toLocaleString('pt-BR', options);
        return dataFormatadaPersonalizada.replace(',', ' -').replace('-feira -', ',').replace(' às da ', ', de ');
    }
    return "sem registro de data";
}

function exibirTabela() {

    const meusDados = JSON.parse(localStorage.getItem('meusDados')) || [];

    if (meusDados.length > 0) {
        alterarExibicaoConformeTamanhoDaTabela(false);
        criarTabelaHTMLParaApresentacaoDosDadosDosTreinosPassados(meusDados, true);
    }
    else {
        alterarExibicaoConformeTamanhoDaTabela(true);
    }

}

function identificarEmojiDeIntensidadeDoExercicio(valor) {

    if (valor === 'muito leve') {
        emoji = '\u{1F601}';
    }
    else if (valor === 'leve') {
        emoji = '\u{1F642}';
    }
    else if (valor === 'moderado') {
        emoji = '\u{1F610}';
    }
    else if (valor === 'pesado') {
        emoji = '\u{1F630}';
    }
    else if (valor === 'muito pesado') {
        emoji = '\u{1F975}';
    }
    else {
        emoji = 'sem emoji definido';
    }

    return emoji;
}

function pesquisarExecucoesAnterioresDoTreino(index) {
    let meusDados = JSON.parse(localStorage.getItem('meusDados')) || [];
    const itemParaPesquisar = meusDados[index];
    let dadosFiltrado = [];
    meusDados.forEach((registro, indexRegistros) => {
        if( (registro.exercicio.trim().toLowerCase() == itemParaPesquisar.exercicio.trim().toLowerCase()) && (indexRegistros >= index) ) {
            dadosFiltrado.push(registro);
        }
    });

    apresentarDivAlvo('divTreinos');
    if (dadosFiltrado.length > 0) {
        criarTabelaHTMLParaApresentacaoDosDadosDosTreinosPassados(dadosFiltrado, false);
        const elementoZoom = document.getElementById('container');
        elementoZoom.style.transform = `scale(1.4)`;
    }
    else {
        alert('Nenhum histórico deste exercício foi encontrado')
    }

}

function adicionarExecucaoDeTreinoEspecifico(index) {
    let meusDados = JSON.parse(localStorage.getItem('meusDados')) || [];
    const itemParaEditar = meusDados[index];
    apresentarDivAlvo('divAdicionarExercicio');
    document.getElementById('exercicio').value = itemParaEditar.exercicio.trim().toLowerCase();
    document.getElementById('carga').value = itemParaEditar.carga;
    // document.getElementById('intensidade').value = itemParaEditar.intensidade;
}

function editarExecucaoDeTreinoEspecifico(index) {
    let meusDados = JSON.parse(localStorage.getItem('meusDados')) || [];
    const itemParaEditar = meusDados[index];
    apresentarDivAlvo('divEditarExercicio');
    document.getElementById('exercicio').value = itemParaEditar.exercicio.trim().toLowerCase();
    document.getElementById('carga').value = itemParaEditar.carga;
    document.getElementById('intensidade').value = itemParaEditar.intensidade;
    document.getElementById('index').value = index;
}

function excluirRegistro(index) {

    let meusDados = JSON.parse(localStorage.getItem('meusDados')) || [];
    let itemAlvo = meusDados[index];

    if (confirm("Tem certeza que deseja excluir ("+itemAlvo.exercicio+"-"+itemAlvo.carga+"-"+itemAlvo.intensidade+") ?")) {
        meusDados.splice(index, 1);
        localStorage.setItem('meusDados', JSON.stringify(meusDados, null, 2));
        apresentarDivAlvo('divTreinos');
    }
}

function excluirTodosRegistros() {
    if (confirm("Tem certeza que deseja excluir TODOS os registros?\n\nVocê pode exportar os registros NO BOTÃO AO LADO antes de realizar esta exclusão.")) {
        localStorage.setItem('meusDados', JSON.stringify([]));
    }
}

function criarListenerDeImportacaoDeJson() {
    const input = document.getElementById('botaoImportarJsonDeTreino');
    input.addEventListener('change', () => {
      const reader = new FileReader();

      reader.onload = () => {
        const meusDados = JSON.parse(reader.result);
        localStorage.setItem('meusDados', JSON.stringify(meusDados, null, 2));
        console.log('JSON importado com sucesso!');
        exibirTabela();
      };

      reader.readAsText(input.files[0]);
    });
}

// function criarListenerDeZoom() {

//     const input = document.getElementById('zoomInput');
//     const elementoZoom = document.getElementById('container');

//     input.addEventListener('input', () => {
//         const valorZoom = input.value;
//         elementoZoom.style.transform = `scale(${valorZoom})`;
//     });

// }

function mostrarMenuLateral() {
    const divLateral = document.getElementById('menuLateral');
    if ( !divLateral.classList.contains("animarMenuDeCimaPraBaixo") ) {
        divLateral.classList.add("animarMenuDeCimaPraBaixo");
    }
    else {
        divLateral.classList.remove("animarMenuDeCimaPraBaixo");  
    }
}

function apresentarDivAlvo(divAlvo) {
    
    if( document.getElementById('menuLateral').classList.contains("animarMenuDeCimaPraBaixo") ) {
        document.getElementById("divMenu").click();
    }

    document.getElementById("botaoVoltarNoHistoricoDeTreino").style.display = "none";

    realizarAcoesParaDivAlvoAntesDaApresentacao(divAlvo);
    document.getElementById("divAdicionarExercicio").style.display = "none";
    document.getElementById("divConfiguracoes").style.display = "none";
    document.getElementById("divTreinos").style.display = "none";
    document.getElementById("divConfiguracaoDeTreino").style.display = "none";
    if ( divAlvo ) {
        if ( document.getElementById(divAlvo) ) {
            document.getElementById(divAlvo).style.display = "";
        }
        else if ( divAlvo == 'divEditarExercicio' || divAlvo === 'divAdicionarExercicioGenerico' || divAlvo === 'divAdicionarExercicioEspecifico' ) {
            document.getElementById("divAdicionarExercicio").style.display = "";
        }
        else {
            console.log('Div inexistente: ' + divAlvo);
        }
    }
}

function realizarAcoesParaDivAlvoAntesDaApresentacao(divAlvo) {
    const elementoZoom = document.getElementById('container');
    elementoZoom.style.transform = `scale(1.1)`;
    if ( divAlvo === 'divTreinos' ) {
        exibirTabela();        
        document.getElementById("botaoExecucaoEspecifica").style.display = "none";
        document.getElementById("botaoExecucaoGenerica").style.display = "";
    }
    else if ( divAlvo === 'divAdicionarExercicio' || divAlvo === 'divAdicionarExercicioGenerico' || divAlvo === 'divAdicionarExercicioEspecifico' ) {
        document.getElementById('btnConfirmarAlteracaoDeRegistro').style.display = 'none';
        document.getElementById('btnConfirmarAdicaoDeRegistro').style.display = '';
        limparCamposNaTela();
        preencherComboDeExercicios();
        const elementoZoom = document.getElementById('container');
        elementoZoom.style.transform = `scale(1.3)`;
    }
    else if ( divAlvo === 'divEditarExercicio' ) {
        document.getElementById('btnConfirmarAlteracaoDeRegistro').style.display = '';
        document.getElementById('btnConfirmarAdicaoDeRegistro').style.display = 'none';
        preencherComboDeExercicios();
        const elementoZoom = document.getElementById('container');
        elementoZoom.style.transform = `scale(1.3)`;
    }
    else if ( divAlvo === 'divConfiguracaoDeTreino' ) {
        apresentarExerciciosCadastrados();
        exibirFichasDeTreino();
        ajustarApresentacaoDeBotoesDaCriacaoDeFicha();
    }
    else if ( divAlvo === 'divConfiguracoes' ) {
        apresentarExerciciosCadastrados();
    }

    if ( divAlvo === 'divAdicionarExercicioEspecifico' ) {
        const tabela = document.getElementById("tabelaTreinos");
        if (tabela && tabela.tBodies.length > 0) {
            document.getElementById('exercicio').value = tabela.tBodies[0].rows[0].firstChild.innerHTML.trim().toLowerCase();
        }
    }
    else if ( divAlvo === 'divAdicionarExercicioGenerico' ) {
        document.getElementById('exercicio').value = '';
    }

}

function limparApresentacao() {
    apresentarDivAlvo('divTreinos');
}

function formatarStringParaApresentacao(str) {
    str = str.trim().replace(/\s+/g, '');
    str = str.toLowerCase();
    str = str.replace(/[^a-z0-9]/g, '');
    return str;
}

function adicionarExercicioNoSistema() {

    const nomeDoExercicio = document.getElementById("addExercicio").value;

    if( nomeDoExercicio ) {
        let exerciciosCadastrados = JSON.parse(localStorage.getItem('exerciciosCadastrados')) || [];
        const novoRegistro = {nomeDoExercicio};
        exerciciosCadastrados.push(novoRegistro);
        exerciciosCadastrados.sort((atual, seguinte) => {
            if (atual.nomeDoExercicio.substring(0,3) < seguinte.nomeDoExercicio.substring(0,3)) {
                return -1;
            }
            if (atual.nomeDoExercicio.substring(0,3) > seguinte.nomeDoExercicio.substring(0,3)) {
                return 1;
            }
            return 0;
        });
        localStorage.setItem('exerciciosCadastrados', JSON.stringify(exerciciosCadastrados));
    }

    document.getElementById("addExercicio").value = '';
    apresentarExerciciosCadastrados();
}

function apresentarExerciciosCadastrados() {
    let exerciciosCadastrados = JSON.parse(localStorage.getItem('exerciciosCadastrados')) || [];
    const lista = document.getElementById('exerciciosCadastrados');
    const rotuloExerciciosCadastrados = document.getElementById('rotuloExerciciosCadastrados');
    rotuloExerciciosCadastrados.style.display = "";
    lista.innerHTML = '';
    exerciciosCadastrados.forEach(exercicioCadastrado => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${exercicioCadastrado.nomeDoExercicio}</strong>`;
        lista.appendChild(li);
    });
}

function preencherComboDeExercicios() {
    const exerciciosCadastrados = JSON.parse(localStorage.getItem('exerciciosCadastrados')) || [];
    const select = document.getElementById('exercicio');
    select.innerHTML = '';
    const optionDefault = document.createElement('option');
    optionDefault.value = '';
    optionDefault.text = '';
    select.appendChild(optionDefault);
    exerciciosCadastrados.forEach(opcao => {
        const option = document.createElement('option');
        option.value = opcao.nomeDoExercicio.trim().toLowerCase();
        option.text = opcao.nomeDoExercicio.trim();
        select.appendChild(option);
    });
    return select;
}

function init() {
    criarListenerDeImportacaoDeJson();
    // criarListenerDeZoom();
    //ajustarProblemasNosJSON();
    limparApresentacao();
}

init();
