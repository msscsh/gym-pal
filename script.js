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

function ajustarVersaoDoJSON() {

    const dados = JSON.parse(localStorage.getItem('meusDados')) || [];
    dados.forEach(objeto => {
        mudarCampoPrimeiroNivelDeUmRotuloParaOutroRotulo(objeto, 'nome', 'exercicio');
    });
    localStorage.setItem('meusDados', JSON.stringify(dados));
}

function mudarCampoPrimeiroNivelDeUmRotuloParaOutroRotulo(objeto, nomeAntigo, nomeAtual) {
    if (nomeAntigo in objeto) {
        objeto[nomeAtual] = objeto[nomeAntigo];
        delete objeto[nomeAntigo];
    }
}

function adicionarRegistro() {
    const exercicio = document.getElementById('exercicio').value;
    const carga = document.getElementById('carga').value;
    const intensidade = document.getElementById('intensidade').value;
    const novoRegistro = { exercicio, carga, intensidade };
    let dados = JSON.parse(localStorage.getItem('meusDados')) || [];
    dados.unshift(novoRegistro);
    localStorage.setItem('meusDados', JSON.stringify(dados));
    limparCamposNaTela();
    exibirTabela();
}


function limparCamposNaTela() {
    document.getElementById('exercicio').value = ''
    document.getElementById('carga').value = ''
    document.getElementById('intensidade').value = ''
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
        const celulaAcoes = novaLinha.insertCell();

        celulaExercicio.textContent = registro.exercicio;
        celulaCarga.textContent = registro.carga;
        celulaIntensidade.textContent = identificarEmojiDeIntensidadeDoExercicio(registro.intensidade);

        const botaoExcluir = document.createElement('button');
        botaoExcluir.textContent = 'DEL';
        botaoExcluir.classList.add('botaoExcluirRegistroDeTreino');
        botaoExcluir.onclick = () => {
            excluirRegistro(index);
        };
        celulaAcoes.appendChild(botaoExcluir);
    });
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


function excluirRegistro(index) {
    let dados = JSON.parse(localStorage.getItem('meusDados')) || [];
    dados.splice(index, 1);
    localStorage.setItem('meusDados', JSON.stringify(dados));
    exibirTabela();
}

function excluirUltimoRegistro() {
    let dados = JSON.parse(localStorage.getItem('meusDados')) || [];
    dados.pop();
    localStorage.setItem('meusDados', JSON.stringify(dados));
    exibirTabela();
}

function excluirTodosRegistros() {
    if (confirm("Tem certeza que deseja excluir todos os registros?")) {
        localStorage.clear();
        exibirTabela();
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

function init() {
    limparCamposNaTela();
    criarListenerDeImportacaoDeJson();
    criarListenerDeZoom();
    ajustarVersaoDoJSON();

    window.onload = function() {
        exibirTabela();
    };
}

init()
