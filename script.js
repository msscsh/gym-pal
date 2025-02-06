function downloadJSON(jsonData) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonData);
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", dataStr);
    downloadLink.setAttribute("download", "meu_arquivo.json");
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function exportarJSON() {
    const jsonSalvo = localStorage.getItem('meusDados');
    downloadJSON(jsonSalvo);
}

/**
 * Somente quando houver alterações no json
 * */
function ajustarProblemasNosJSON() {

    const meusDados = JSON.parse(localStorage.getItem('meusDados')) || [];

    meusDados.forEach(umDado => {
        const nomeAmigavelParaApresentacao = recuperNomeDeApresentacaoDoExercicio(umDado.exercicio);
        umDado.exercicio = nomeAmigavelParaApresentacao;
        // mudarCampoPrimeiroNivelDeUmRotuloParaOutroRotulo(umDado, 'nome', 'exercicio');
    });

    localStorage.setItem('meusDados', JSON.stringify(meusDados));
}

function mudarCampoPrimeiroNivelDeUmRotuloParaOutroRotulo(objeto, nomeAntigo, nomeAtual) {
    if (nomeAntigo in objeto) {
        objeto[nomeAtual] = objeto[nomeAntigo];
        delete objeto[nomeAntigo];
    }
}

function recuperNomeDeApresentacaoDoExercicio(exercicioId) {
    const exerciciosCadastrados = JSON.parse(localStorage.getItem('exerciciosCadastrados')) || [];
    exerciciosCadastrados.forEach(exercicioCadastrado => {
        if ( exercicioCadastrado.nomeId === exercicioId) {
            return exercicioCadastrado.nomeDoExercicio;
        }
    });
}

function adicionarRegistro() {

    const index = document.getElementById('index').value;
    const exercicio = document.getElementById('exercicio').value;
    const carga = document.getElementById('carga').value;
    const intensidade = document.getElementById('intensidade').value;

    let dados = JSON.parse(localStorage.getItem('meusDados')) || [];

    if (index) {
        let itemAlvo = dados[index];
        itemAlvo.exercicio = exercicio;
        itemAlvo.carga = carga;
        itemAlvo.intensidade = intensidade;
        dados[index] = itemAlvo;
    }
    else {
        const timestampDoExercicio = Date.now();
        const novoRegistro = { exercicio, carga, intensidade, timestampDoExercicio };
        dados.unshift(novoRegistro);
    }

    localStorage.setItem('meusDados', JSON.stringify(dados));
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

function criarTabelaHTMLParaApresentacaoDosDadosDosTreinosPassados(dados) {
    const tabela = document.getElementById('tabelaTreinos').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';
    dados.forEach((registro, index) => {
        const novaLinha = tabela.insertRow();
        const celulaExercicio = novaLinha.insertCell();
        const celulaCarga = novaLinha.insertCell();
        const celulaIntensidade = novaLinha.insertCell();
        const celulaDataHoraExercicio = novaLinha.insertCell();
        const celulaAcoes = novaLinha.insertCell();

        celulaExercicio.textContent = registro.exercicio;
        celulaCarga.textContent = registro.carga;
        celulaIntensidade.textContent = identificarEmojiDeIntensidadeDoExercicio(registro.intensidade);
        celulaDataHoraExercicio.textContent = converterTimestampParaFormatacaoDataEHora(registro.timestampDoExercicio);

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

        celulaAcoes.appendChild(botaoEditar);
        celulaAcoes.appendChild(botaoExcluir);
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

    const dados = JSON.parse(localStorage.getItem('meusDados')) || [];

    if (dados.length > 0) {
        alterarExibicaoConformeTamanhoDaTabela(false);
        criarTabelaHTMLParaApresentacaoDosDadosDosTreinosPassados(dados)
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

function editarRegistro(index) {
    let dados = JSON.parse(localStorage.getItem('meusDados')) || [];
    const itemParaEditar = dados[index];
    document.getElementById('exercicio').value = itemParaEditar.exercicio;
    document.getElementById('carga').value = itemParaEditar.carga;
    document.getElementById('intensidade').value = itemParaEditar.intensidade;
    document.getElementById('index').value = index;
    mostrarTelaParaAdicionarUmaExecucaoDeTreino();
}

function excluirRegistro(index) {
    let dados = JSON.parse(localStorage.getItem('meusDados')) || [];
    dados.splice(index, 1);
    localStorage.setItem('meusDados', JSON.stringify(dados));
}

function excluirUltimoRegistro() {
    let dados = JSON.parse(localStorage.getItem('meusDados')) || [];
    dados.pop();
    localStorage.setItem('meusDados', JSON.stringify(dados));
}

function excluirTodosRegistros() {
    if (confirm("Tem certeza que deseja excluir todos os registros?")) {
        localStorage.clear();
    }
}

function criarListenerDeImportacaoDeJson() {
    const input = document.getElementById('botaoImportarJsonDeTreino');
    input.addEventListener('change', () => {
      const reader = new FileReader();

      reader.onload = () => {
        const json = JSON.parse(reader.result);
        localStorage.setItem('meusDados', JSON.stringify(json));
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

function mostrarDiv() {
    const divLateral = document.getElementById('menuLateral');
    if ( !divLateral.classList.contains("animarMenuDeCimaPraBaixo") ) {
        divLateral.classList.add("animarMenuDeCimaPraBaixo");
    }
    else {
        divLateral.classList.remove("animarMenuDeCimaPraBaixo");  
    }
}

function mostrarTabelaDeTreinos() {
    exibirTabela();
    document.getElementById("divAdicionarExercicio").style.display = "none";
    document.getElementById("divConfiguracaoDeTela").style.display = "none";
    document.getElementById("divTreinos").style.display = "";
    document.getElementById("divConfiguracaoDeTreino").style.display = "none";
}

function mostrarTelaParaAdicionarUmaExecucaoDeTreino() {
    preencherComboDeExercicios();
    document.getElementById("divAdicionarExercicio").style.display = "";
    document.getElementById("divConfiguracaoDeTela").style.display = "none";
    document.getElementById("divTreinos").style.display = "none";
    document.getElementById("divConfiguracaoDeTreino").style.display = "none";
}

function mostrarTelaParaConfigurar() {
    document.getElementById("divAdicionarExercicio").style.display = "none";
    document.getElementById("divConfiguracaoDeTela").style.display = "";
    document.getElementById("divTreinos").style.display = "none";
    document.getElementById("divConfiguracaoDeTreino").style.display = "none";
}

function mostrarTelaParaConfigurarTreino() {
    apresentarExerciciosCadastrados();
    document.getElementById("divAdicionarExercicio").style.display = "none";
    document.getElementById("divConfiguracaoDeTela").style.display = "none";
    document.getElementById("divTreinos").style.display = "none";
    document.getElementById("divConfiguracaoDeTreino").style.display = "";
}

function limparApresentacao() {
    document.getElementById("divAdicionarExercicio").style.display = "none";
    document.getElementById("divConfiguracaoDeTela").style.display = "none";
    document.getElementById("divTreinos").style.display = "none";
    document.getElementById("divConfiguracaoDeTreino").style.display = "none";
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
        const nomeId = formatarStringParaApresentacao(nomeDoExercicio);
        const novoRegistro = { nomeId, nomeDoExercicio};
        exerciciosCadastrados.add(novoRegistro);
        exerciciosCadastrados.sort();
        localStorage.setItem('exerciciosCadastrados', JSON.stringify(exerciciosCadastrados));
    }

    document.getElementById("addExercicio").value = '';
    apresentarExerciciosCadastrados();
}

function apresentarExerciciosCadastrados() {
    let exerciciosCadastrados = JSON.parse(localStorage.getItem('exerciciosCadastrados')) || [];
    const lista = document.getElementById('exerciciosCadastrados');
    lista.innerHTML = '';
    exerciciosCadastrados.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${item.nomeDoExercicio}:</strong> ${item.nomeId}`;
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
