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

function adicionarRegistro() {

    const index = document.getElementById('index').value;
    const exercicio = document.getElementById('exercicio').value;
    const carga = document.getElementById('carga').value;
    const intensidade = document.getElementById('intensidade').value;

    let meusDados = JSON.parse(localStorage.getItem('meusDados')) || [];

    if (index) {
        let itemAlvo = meusDados[index];
        itemAlvo.exercicio = exercicio;
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
    limparCamposNaTela();
    mostrarTabelaDeTreinos();
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

function criarTabelaHTMLParaApresentacaoDosDadosDosTreinosPassados(meusDados, isAcoesApresentacaoDefault) {
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

        if (isAcoesApresentacaoDefault) {

            const celulaAcoes = novaLinha.insertCell();

            const botaoExcluir = document.createElement('button');
            botaoExcluir.textContent = 'DEL';
            botaoExcluir.classList.add('botaoExcluirRegistroDeTreino');
            botaoExcluir.onclick = () => {
                excluirRegistro(index);
            };

            const botaoEditar = document.createElement('button');
            botaoEditar.textContent = 'EDIT';
            botaoEditar.classList.add('botaoEditarRegistroDeTreino');
            botaoEditar.onclick = () => {
                editarRegistro(index);
            };

            const botaoAdicionarExecucaoDeTreino = document.createElement('button');
            botaoAdicionarExecucaoDeTreino.textContent = '+';
            botaoAdicionarExecucaoDeTreino.classList.add('botaoAdicionarExecucaoDeTreino');
            botaoAdicionarExecucaoDeTreino.onclick = () => {
                adicionarExecucao(index);
            };


            const botaoPesquisarExecucoesAnterioresDoTreino = document.createElement('button');
            botaoPesquisarExecucoesAnterioresDoTreino.textContent = '\u{1F50D}';
            botaoPesquisarExecucoesAnterioresDoTreino.classList.add('botaoPesquisarExecucoesAnterioresDoTreino');
            botaoPesquisarExecucoesAnterioresDoTreino.onclick = () => {
                pesquisarExecucoesAnterioresDoTreino(index);
            };

            celulaAcoes.appendChild(botaoEditar);
            celulaAcoes.appendChild(botaoPesquisarExecucoesAnterioresDoTreino);
            celulaAcoes.appendChild(botaoAdicionarExecucaoDeTreino);

            celulaAcoes.appendChild(botaoExcluir);

        }
        else {
            const celulaAcoes = novaLinha.insertCell();
            const botaoVoltar = document.createElement('button');
            botaoVoltar.textContent = '<<';
            botaoVoltar.classList.add('botaoAdicionarExecucaoDeTreino');
            botaoVoltar.onclick = () => {
                apresentarDivAlvo('divTreinos');
            };
            celulaAcoes.appendChild(botaoVoltar);
        }

    });
}

function converterTimestampParaFormatacaoDataEHora(timestamp) {
    if (timestamp) {
        const data = new Date(timestamp);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const dataFormatadaPersonalizada = data.toLocaleString('pt-BR', options);
        return dataFormatadaPersonalizada;
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
        if( (registro.exercicio.trim().toLowerCase() == itemParaPesquisar.exercicio.trim().toLowerCase()) && (indexRegistros > index) ) {
            dadosFiltrado.push(registro);
        }
    });

    apresentarDivAlvo('divTreinos');
    if (dadosFiltrado.length > 0) {
        criarTabelaHTMLParaApresentacaoDosDadosDosTreinosPassados(dadosFiltrado, false);
    }
    else {
        alert('Nenhum histórico deste exercício foi encontrado')
    }

}

function adicionarExecucao(index) {
    let meusDados = JSON.parse(localStorage.getItem('meusDados')) || [];
    const itemParaEditar = meusDados[index];
    document.getElementById('exercicio').value = itemParaEditar.exercicio;
    document.getElementById('carga').value = itemParaEditar.carga;
    document.getElementById('intensidade').value = itemParaEditar.intensidade;
    apresentarDivAlvo('divAdicionarExercicio');
}

function editarRegistro(index) {
    let meusDados = JSON.parse(localStorage.getItem('meusDados')) || [];
    const itemParaEditar = meusDados[index];
    document.getElementById('exercicio').value = itemParaEditar.exercicio;
    document.getElementById('carga').value = itemParaEditar.carga;
    document.getElementById('intensidade').value = itemParaEditar.intensidade;
    document.getElementById('index').value = index;
    apresentarDivAlvo('divAdicionarExercicio');
}

function excluirRegistro(index) {
    let meusDados = JSON.parse(localStorage.getItem('meusDados')) || [];
    meusDados.splice(index, 1);
    localStorage.setItem('meusDados', JSON.stringify(meusDados, null, 2));
    apresentarDivAlvo('divTreinos');
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

function criarListenerDeZoom() {

    const input = document.getElementById('zoomInput');
    const elementoZoom = document.getElementById('container');

    input.addEventListener('input', () => {
        const valorZoom = input.value;
        elementoZoom.style.transform = `scale(${valorZoom})`;
    });

}

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
    realizarAcoesParaDivAlvoAntesDaApresentacao(divAlvo);
    document.getElementById("divAdicionarExercicio").style.display = "none";
    document.getElementById("divConfiguracaoDeTela").style.display = "none";
    document.getElementById("divTreinos").style.display = "none";
    document.getElementById("divConfiguracaoDeTreino").style.display = "none";
    if ( divAlvo ) {
        document.getElementById(divAlvo).style.display = "";
    }
}

function realizarAcoesParaDivAlvoAntesDaApresentacao(divAlvo) {
    if ( divAlvo === 'divTreinos' ) {
        exibirTabela();
    }
    else if ( divAlvo === 'divAdicionarExercicio' ) {
        preencherComboDeExercicios();
    }
    else if ( divAlvo === 'divConfiguracaoDeTreino' ) {
        apresentarExerciciosCadastrados();
    }
}

function limparApresentacao() {
    apresentarDivAlvo();
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
    exerciciosCadastrados.forEach(opcao => {
      const option = document.createElement('option');
      option.value = opcao.nomeDoExercicio;
      option.text = opcao.nomeDoExercicio;
      select.appendChild(option);
    });
}

function init() {
    limparCamposNaTela();
    criarListenerDeImportacaoDeJson();
    criarListenerDeZoom();
    ajustarProblemasNosJSON();
    limparApresentacao();
}

init();
